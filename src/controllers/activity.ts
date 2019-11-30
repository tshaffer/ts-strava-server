import { Request, Response } from 'express';

import { fetchSummaryActivities, retrieveAccessToken, fetchDetailedActivity } from '../controllers';
import { StravatronDetailedActivity, StravatronSegmentEffort, StravatronDetailedActivityAttributes, StravatronStreamData, StravatronStream, StravatronSummarySegment } from '../type';
import { fetchStream } from './strava';

export function getActivities(request: Request, response: Response) {
  console.log('getActivities');
  return retrieveAccessToken()
    .then((accessToken: any) => {
      console.log('accessToken');
      console.log(accessToken);
      /*
        seconds calculation
        seconds per minute: 60
        minutes per hour: 60
        hours per day: 24
        days per week: 7
        seconds in last week: 7 * 24 * 60 * 60 = 604800
      */

      // for afterDate, strava only seems to look at the date; that is, it doesn't look at the time
      // therefore, jump to the next day - the result is that it's possible to lose an activity that occurs on
      // the same date if the activities happen to fall on a page boundary
      // const afterDate = new Date(dateOfLastFetchedActivity);
      const afterDate = new Date('November 1, 2019 00:00:00');
      afterDate.setDate(afterDate.getDate() + 1); // given how strava treats 'afterDate', the following shouldn't make any difference, but ....
      afterDate.setHours(0);
      afterDate.setMinutes(0);
      afterDate.setSeconds(0);
      afterDate.setMilliseconds(0);

      let secondsSinceEpochOfLastActivity = Math.floor(afterDate.getTime() / 1000);
      if (secondsSinceEpochOfLastActivity < 0) {
        secondsSinceEpochOfLastActivity = 0;
      }

      console.log('seconds since...');
      console.log(secondsSinceEpochOfLastActivity);

      fetchSummaryActivities(accessToken, secondsSinceEpochOfLastActivity)
        .then((summaryActivities: any[]) => {
          response.json(summaryActivities);
        });
    })
    .catch((err: Error) => {
      console.log('accessToken error: ', err);
    });
}

export function getDetailedActivity(request: Request, response: Response) {

  const activityId: string = request.query.activityId;
  let stravaDetailedActivity: StravatronDetailedActivity;

  let retDetailedActivityAttributes: StravatronDetailedActivityAttributes;
  let retLocationData: any[] = [];
  let retSegments: StravatronSummarySegment[] = [];
  let retSegmentsEfforts: StravatronSegmentEffort[] = [];

  return retrieveAccessToken()
    .then((accessToken: any) => {
      fetchDetailedActivity(accessToken, activityId)
        .then((detailedActivity: StravatronDetailedActivity) => {
          // response.json(detailedActivity);
          stravaDetailedActivity = detailedActivity;
          return fetchStream(accessToken, activityId);
        }).then((stravaStreams: any[]) => {

          retDetailedActivityAttributes =
            {
              calories: stravaDetailedActivity.calories,
              segmentEfforts: stravaDetailedActivity.segmentEfforts,
              map: stravaDetailedActivity.map,
              streams: stravaStreams,
            };

          // add streams to the db
          const stravatronStreamData: StravatronStreamData = getStreamData(stravaStreams);
          retLocationData = stravatronStreamData.locationData;

          // dispatch(setActivityLocations(locationData));

          // TEDTODO - the following could be done independent from fetchStream

          let segments: StravatronSummarySegment[] = [];
          let segmentIds: number[] = [];
          let segmentEfforts = [];

          for (const stravaSegmentEffort of stravaDetailedActivity.segmentEfforts) {

            const segment: StravatronSummarySegment = stravaSegmentEffort.segment;
            segments.push(segment);

            segmentIds.push(segment.id);
            segmentEfforts.push(stravaSegmentEffort);

            //   // add segment, segmentEffort to db
            //   const addSegmentPromise = dbServices.addSegment(segment);
            //   addSegmentPromise.then( () => {
            //   }, (_) => {
            //     // console.log("segment addition failed:", activityId);
            //   });

            //   const addSegmentEffortPromise = dbServices.addSegmentEffort(segmentEffort);
            //   addSegmentEffortPromise.then( () => {
            //   }, (_) => {
            //     // console.log("segmentEffort addition failed:", segmentEffort.activityId);
            //   });
            // });
          }

          retSegments = segments;
          retSegmentsEfforts = segmentEfforts;

          const retData: any = {
            detailedActivityAttributes: retDetailedActivityAttributes,
            locationData: retLocationData,
            segments: retSegments,
            segmentEfforts: retSegmentsEfforts,
          };
          response.json(retData);
        });
    })
    .catch((err: Error) => {
      console.log('accessToken error: ', err);
    });


}

function getStreamData(stravaStreams: StravatronStream[]): StravatronStreamData {

  let timeData: any[];
  let locationData: any[];
  let elevationData: any[];
  let distanceData: any[];
  let gradientData: any[];

  for (const stravaStream of stravaStreams) {

    switch (stravaStream.type) {
      case 'time':
        timeData = stravaStream.data;
        break;
      case 'distance':
        distanceData = stravaStream.data;
        break;
      case 'altitude':
        elevationData = stravaStream.data;
        break;
      case 'latlng':
        locationData = stravaStream.data;
        break;
      case 'grade_smooth':
        gradientData = stravaStream.data;
        break;
    }

  }

  const streamData: StravatronStreamData =
  {
    timeData,
    locationData,
    elevationData,
    distanceData,
    gradientData,
  };

  return streamData;
}
