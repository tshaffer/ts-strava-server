import { Request, Response } from 'express';

import { fetchSummaryActivities, retrieveAccessToken, fetchDetailedActivity } from '../controllers';
import { StravaNativeDetailedSegment, StravatronDetailedActivity, StravatronSegmentEffort, StravatronDetailedActivityAttributes, StravatronStreamData, StravatronStream, StravatronSummarySegment, StravaNativeDetailedSegmentEffort, StravatronDetailedSegment, StravatronSegmentEffortsForSegment } from '../type';
import { fetchStreams, fetchSegment, fetchAllEfforts } from './strava';

function getSecondsSinceLastFetch(): number {

  // TEDTODO - see how this was done in strava classic

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

  let secondsSinceLastFetch = Math.floor(afterDate.getTime() / 1000);
  if (secondsSinceLastFetch < 0) {
    secondsSinceLastFetch = 0;
  }

  console.log('seconds since...');
  return secondsSinceLastFetch;
}

export function getActivities(request: Request, response: Response) {

  return retrieveAccessToken()
    .then((accessToken: any) => {

      const secondsSinceLastFetch = getSecondsSinceLastFetch();
      fetchSummaryActivities(accessToken, secondsSinceLastFetch)
        .then((summaryActivities: any[]) => {
          response.json(summaryActivities);
        });
    })
    .catch((err: Error) => {
      console.log('accessToken error: ', err);
    });
}

function getAllEffortsForAllSegments(accessToken: any, athleteId: string, segmentIds: number[]): Promise<StravatronSegmentEffortsForSegment[]> {

  const allEffortsForSegmentsInCurrentActivity: StravatronSegmentEffortsForSegment[] = [];

  const getNextEffortsForSegment = (index: number): Promise<StravatronSegmentEffortsForSegment[]> => {

    if (index >= segmentIds.length) {
      return Promise.resolve(allEffortsForSegmentsInCurrentActivity);
    }

    const segmentId = segmentIds[index];

    fetchAllEfforts(accessToken, athleteId, segmentId)
      .then((segmentEffortsForSegment: StravatronSegmentEffortsForSegment) => {
        allEffortsForSegmentsInCurrentActivity.push(segmentEffortsForSegment);
        return getNextEffortsForSegment(index + 1);
      });
  };

  return getNextEffortsForSegment(0);
}

function getSegments(accessToken: any, segmentIds: number[]): Promise<StravatronDetailedSegment[]> {

  const detailedSegments: StravatronDetailedSegment[] = [];

  const getNextSegment = (index: number): Promise<StravatronDetailedSegment[]> => {

    if (index >= segmentIds.length) {
      return Promise.resolve(detailedSegments);
    }

    const segmentId = segmentIds[index];

    fetchSegment(accessToken, segmentId)
      .then((detailedSegment: StravatronDetailedSegment) => {
        detailedSegments.push(detailedSegment);
        return getNextSegment(index + 1);
      });
  };

  return getNextSegment(0);
}

function getSegmentEffortsInActivity(allEffortsForSegmentsInCurrentActivity: StravatronSegmentEffortsForSegment[]): StravatronSegmentEffort[] {

  const segmentEffortsInActivity: StravatronSegmentEffort[] = [];

  for (const allEffortsForSegment of allEffortsForSegmentsInCurrentActivity) {
    // convert to stravatron segmentEfforts
    for (const effortForSegment of allEffortsForSegment) {
      const stravatronSummarySegment: StravatronSummarySegment = {
        id: effortForSegment.segment.id,
        name: effortForSegment.segment.name,
        distance: effortForSegment.segment.distance,
        averageGrade: effortForSegment.segment.averageGrade,
        maximumGrade: effortForSegment.segment.maximumGrade,
        elevationHigh: effortForSegment.segment.elevationHigh,
        elevationLow: effortForSegment.segment.elevationLow,
        activityType: effortForSegment.segment.activityType,
        climbCategory: effortForSegment.segment.climbCategory,
        startLatlng: effortForSegment.segment.startLatlng,
        endLatlng: effortForSegment.segment.endLatlng,
      };

      const achievements: any[] = [];
      for (const achievement of effortForSegment.achievements) {
        achievements.push({
          rank: achievement.rank,
          type: achievement.type,
          typeId: achievement.typeId,
        });
      }

      const stravatronSegmentEffort: StravatronSegmentEffort = {
        id: effortForSegment.id,
        name: effortForSegment.name,
        activityId: effortForSegment.activityId,
        elapsedTime: effortForSegment.elapsedTime,
        movingTime: effortForSegment.movingTime,
        startDateLocal: effortForSegment.startDateLocal,
        distance: effortForSegment.distance,
        averageWatts: effortForSegment.averageWatts,
        segment: stravatronSummarySegment,
        prRank: effortForSegment.prRank,
        achievements,
        averageCadence: effortForSegment.averageCadence,
        averageHeartrate: effortForSegment.averageHeartrate,
        deviceWatts: effortForSegment.deviceWatts,
        maxHeartrate: effortForSegment.maxHeartrate,
        startDate: effortForSegment.startDate,
      };

      segmentEffortsInActivity.push(stravatronSegmentEffort);
    }
  }
  return segmentEffortsInActivity;
}

export function getDetailedActivity(request: Request, response: Response): Promise<any> {

  const activityId: string = request.query.activityId;

  let accessToken: any;
  let detailedActivity: StravatronDetailedActivity;
  let detailedActivityAttributes: StravatronDetailedActivityAttributes;
  const segments: StravatronSummarySegment[] = [];
  const segmentIds: number[] = [];
  let detailedSegments: StravatronDetailedSegment[];
  let segmentEffortsInActivity: StravatronSegmentEffort[];
  const segmentEfforts: StravatronSegmentEffort[] = [];

  return retrieveAccessToken()

    .then((accessTokenRet: any) => {

      accessToken = accessTokenRet;
      return fetchDetailedActivity(accessToken, activityId);

    }).then((detailedActivityRet: StravatronDetailedActivity) => {

      detailedActivity = detailedActivityRet;


      // retrieve all segmentEfforts and segments from the detailed activity
      for (const stravaSegmentEffort of detailedActivity.segmentEfforts) {
        const segment: StravatronSummarySegment = stravaSegmentEffort.segment;
        segments.push(segment);
        segmentIds.push(segment.id);
        segmentEfforts.push(stravaSegmentEffort);
      }

      return getSegments(accessToken, segmentIds);

    }).then((detailedSegmentsRet: StravatronDetailedSegment[]) => {

      detailedSegments = detailedSegmentsRet;

      const athleteId = '2843574';            // pa
      // const athleteId = '7085811';         // ma

      return getAllEffortsForAllSegments(accessToken, athleteId, segmentIds);

    }).then((allEffortsForSegmentsInCurrentActivity) => {
      segmentEffortsInActivity = getSegmentEffortsInActivity(allEffortsForSegmentsInCurrentActivity);
      return fetchStreams(accessToken, activityId);
    }).then((streams: StravatronStream[]) => {

      const stravatronStreamData: StravatronStreamData = getStreamData(streams);

      detailedActivityAttributes =
        {
          calories: detailedActivity.calories,
          segmentEfforts: detailedActivity.segmentEfforts,
          map: detailedActivity.map,
          streams,
        };

      const retData: any = {
        detailedActivityAttributes,
        locationData: stravatronStreamData.locationData,
        segments,
        detailedSegments,
        segmentEfforts,
        segmentEffortsInActivity,
      };
      response.json(retData);
    });
}

export function oldgetDetailedActivity(request: Request, response: Response) {

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
            const fetchAllEffortsPromises: Array<Promise<StravatronSegmentEffort[]>> = [];
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
                    allEffortsForSegment.forEach((stravaSegmentEffort: StravatronSegmentEffort) => {

                      const stravatronSummarySegment: StravatronSummarySegment = {
                        id: stravaSegmentEffort.segment.id,
                        name: stravaSegmentEffort.segment.name,
                        distance: stravaSegmentEffort.segment.distance,
                        averageGrade: stravaSegmentEffort.segment.averageGrade,
                        maximumGrade: stravaSegmentEffort.segment.maximumGrade,
                        elevationHigh: stravaSegmentEffort.segment.elevationHigh,
                        elevationLow: stravaSegmentEffort.segment.elevationLow,
                        activityType: stravaSegmentEffort.segment.activityType,
                        climbCategory: stravaSegmentEffort.segment.climbCategory,
                        startLatlng: stravaSegmentEffort.segment.startLatlng,
                        endLatlng: stravaSegmentEffort.segment.endLatlng,
                      };

                      const achievements: any[] = [];
                      for (const achievement of stravaSegmentEffort.achievements) {
                        achievements.push({
                          rank: achievement.rank,
                          type: achievement.type,
                          typeId: achievement.typeId,
                        });
                      }

                      const stravatronSegmentEffort: StravatronSegmentEffort = {
                        id: stravaSegmentEffort.id,
                        name: stravaSegmentEffort.name,
                        activityId: stravaSegmentEffort.activityId,
                        elapsedTime: stravaSegmentEffort.elapsedTime,
                        movingTime: stravaSegmentEffort.movingTime,
                        startDateLocal: stravaSegmentEffort.startDateLocal,
                        distance: stravaSegmentEffort.distance,
                        averageWatts: stravaSegmentEffort.averageWatts,
                        segment: stravatronSummarySegment,
                        prRank: stravaSegmentEffort.prRank,
                        achievements,
                        averageCadence: stravaSegmentEffort.averageCadence,
                        averageHeartrate: stravaSegmentEffort.averageHeartrate,
                        deviceWatts: stravaSegmentEffort.deviceWatts,
                        maxHeartrate: stravaSegmentEffort.maxHeartrate,
                        startDate: stravaSegmentEffort.startDate,
                      };

                      segmentEffortsInActivity.push(stravatronSegmentEffort);

                      // // add segment effort to the db
                      // const addSegmentEffortPromise = dbServices.addSegmentEffort(segmentEffort);
                      // addSegmentEffortPromise.then( () => {
                      // }, (_) => {
                      //   // console.log("segmentEffort addition failed:", segmentEffort.activityId);
                      // });
                    });
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
