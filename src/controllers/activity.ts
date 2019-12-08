import { Request, Response } from 'express';

import { fetchSummaryActivities, retrieveAccessToken, fetchDetailedActivity } from '../controllers';
import { StravaNativeDetailedSegment, StravatronDetailedActivity, StravatronSegmentEffort, StravatronDetailedActivityAttributes, StravatronStreamData, StravatronStream, StravatronSummarySegment, StravaNativeDetailedSegmentEffort, StravatronDetailedSegment, StravatronSegmentEffortsForSegment, StravatronSummaryActivity, StravatronDetailedActivityData } from '../type';
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
        .then((summaryActivities: StravatronSummaryActivity[]) => {
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

    return fetchAllEfforts(accessToken, athleteId, segmentId)
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

    return fetchSegment(accessToken, segmentId)
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
  let allSegmentEffortsForSegmentsInActivity: StravatronSegmentEffort[];
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
      allSegmentEffortsForSegmentsInActivity = getSegmentEffortsInActivity(allEffortsForSegmentsInCurrentActivity);
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

      const detailedActivityData: StravatronDetailedActivityData = {
        detailedActivityAttributes,
        locationData: stravatronStreamData.locationData,
        segments,
        detailedSegments,
        segmentEfforts,
        allSegmentEffortsForSegmentsInActivity,
      };
      response.json(detailedActivityData);
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
