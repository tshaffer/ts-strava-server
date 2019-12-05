import { Request, Response } from 'express';

import { fetchSummaryActivities, retrieveAccessToken, fetchDetailedActivity } from '../controllers';
import { StravaNativeDetailedSegment, StravatronDetailedActivity, StravatronSegmentEffort, StravatronDetailedActivityAttributes, StravatronStreamData, StravatronStream, StravatronSummarySegment, StravaNativeDetailedSegmentEffort, StravatronDetailedSegment } from '../type';
import { fetchStreams, fetchSegment, fetchAllEfforts } from './strava';

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
          return fetchStreams(accessToken, activityId);
        }).then((stravaStreams: StravatronStream[]) => {

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

          const segments: StravatronSummarySegment[] = [];
          const segmentIds: number[] = [];
          const segmentEfforts: StravatronSegmentEffort[] = [];

          // segment efforts for each segment in this activity

          for (const stravaSegmentEffort of stravaDetailedActivity.segmentEfforts) {

            const segment: StravatronSummarySegment = stravaSegmentEffort.segment;
            segments.push(segment);

            segmentIds.push(segment.id);
            segmentEfforts.push(stravaSegmentEffort);

            //   // add segment, segmentEffort to db
            //   const addSegmentPromise = dbServices.addSegment(segment);
            //   addSegmentPromise.then( () => {
            //   }, (_) => {
            //     // console.log('segment addition failed:', activityId);
            //   });

            //   const addSegmentEffortPromise = dbServices.addSegmentEffort(segmentEffort);
            //   addSegmentEffortPromise.then( () => {
            //   }, (_) => {
            //     // console.log('segmentEffort addition failed:', segmentEffort.activityId);
            //   });
            // });
          }

          // get segments
          const fetchSegmentPromises: Array<Promise<any>> = [];
          for (const segmentId of segmentIds) {
            fetchSegmentPromises.push(fetchSegment(accessToken, segmentId));
          }

          Promise.all(fetchSegmentPromises).then((detailedSegments: StravaNativeDetailedSegment[]) => {

            retSegments = segments;
            retSegmentsEfforts = segmentEfforts;

            // retrieve all efforts for each of the segments in this activity
            const fetchAllEffortsPromises: Array<Promise<any>> = [];
            const athleteId = '2843574';            // pa
            // const athleteId = '7085811';         // ma
            segmentIds.forEach((segmentId) => {
              fetchAllEffortsPromises.push(fetchAllEfforts(accessToken, athleteId, segmentId));
            });

            Promise.all(fetchAllEffortsPromises).then((allEffortsForSegmentsInCurrentActivity) => {

              const segmentEffortsInActivity: StravatronSegmentEffort[] = [];

              if (allEffortsForSegmentsInCurrentActivity instanceof Array) {
                allEffortsForSegmentsInCurrentActivity.forEach((allEffortsForSegment) => {
                  if (allEffortsForSegment instanceof Array) {

                    // get information about segment as appropriate, presumably from first 'effort for segment'

                    // convert to stravatron segmentEfforts
                    allEffortsForSegment.forEach((stravaSegmentEffort: StravaNativeDetailedSegmentEffort) => {

                      const stravatronSummarySegment: StravatronSummarySegment = {
                        id: stravaSegmentEffort.segment.id,
                        name: stravaSegmentEffort.segment.name,
                        distance: stravaSegmentEffort.segment.distance,
                        averageGrade: stravaSegmentEffort.segment.average_grade,
                        maximumGrade: stravaSegmentEffort.segment.maximum_grade,
                        elevationHigh: stravaSegmentEffort.segment.elevation_high,
                        elevationLow: stravaSegmentEffort.segment.elevation_low,
                        activityType: stravaSegmentEffort.segment.activity_type,
                        climbCategory: stravaSegmentEffort.segment.climb_category,
                        startLatlng: stravaSegmentEffort.segment.start_latlng,
                        endLatlng: stravaSegmentEffort.segment.end_latlng,
                      };

                      const achievements: any[] = [];
                      for (const achievement of stravaSegmentEffort.achievements) {
                        achievements.push({
                          rank: achievement.rank,
                          type: achievement.type,
                          typeId: achievement.type_id,
                        });
                      }

                      const stravatronSegmentEffort: StravatronSegmentEffort = {
                        id: stravaSegmentEffort.id,
                        name: stravaSegmentEffort.name,
                        activityId: stravaSegmentEffort.activity.id,
                        elapsedTime: stravaSegmentEffort.elapsed_time,
                        movingTime: stravaSegmentEffort.moving_time,
                        startDateLocal: stravaSegmentEffort.start_date_local,
                        distance: stravaSegmentEffort.distance,
                        averageWatts: stravaSegmentEffort.average_watts,
                        segment: stravatronSummarySegment,
                        prRank: stravaSegmentEffort.pr_rank,
                        achievements,
                        averageCadence: stravaSegmentEffort.average_cadence,
                        averageHeartrate: stravaSegmentEffort.average_heartrate,
                        deviceWatts: stravaSegmentEffort.device_watts,
                        maxHeartrate: stravaSegmentEffort.max_heartrate,
                        startDate: stravaSegmentEffort.start_date,
                      };

                      segmentEffortsInActivity.push(stravatronSegmentEffort);

                      // // add segment effort to the db
                      // const addSegmentEffortPromise = dbServices.addSegmentEffort(segmentEffort);
                      // addSegmentEffortPromise.then( () => {
                      // }, (_) => {
                      //   // console.log("segmentEffort addition failed:", segmentEffort.activityId);
                      // });
                    });

                    // add all individual segment efforts to store
                    // dispatch(addSegmentEfforts(segmentEfforts));
                  }
                });
              }

              const retData: any = {
                detailedActivityAttributes: retDetailedActivityAttributes,
                locationData: retLocationData,
                segments: retSegments,
                detailedSegments,
                segmentEfforts: retSegmentsEfforts,
                segmentEffortsInActivity,
              };
              response.json(retData);
            });

          });

        });
    })
    .catch((err: Error) => {
      console.log('error: ', err);
    });


}

function getStreamData(stravaStreams: StravatronStream[]): StravatronStreamData {

  let timeData: any[];
  let locationData: any[];
  let elevationData: any[];
  let distanceData: any[];
  let gradientData: any[];
  let cadenceData: any[];
  let heartrateData: any[];
  let wattsData: any[];

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
      case 'cadence':
        cadenceData = stravaStream.data;
        break;
      case 'heartrate':
        heartrateData = stravaStream.data;
        break;
      case 'watts':
        wattsData = stravaStream.data;
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
    cadenceData,
    heartrateData,
    wattsData,
  };

  return streamData;
}
