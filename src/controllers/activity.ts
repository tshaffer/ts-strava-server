import { isNil, isArray } from 'lodash';

import { Request, Response } from 'express';
import { Document } from 'mongoose';

import { fetchSummaryActivities, retrieveAccessToken, fetchDetailedActivity } from '../controllers';
import {
  StravatronDetailedActivity,
  StravatronSegmentEffort,
  StravatronDetailedActivityAttributes,
  StravatronStreams,
  StravatronStream,
  StravatronDetailedSegment,
  StravatronSegmentEffortsForSegment,
  StravatronSummaryActivity,
  StravatronDetailedActivityData,
  StravaNativeDetailedActivity,
} from '../type';
import { fetchStreams, fetchSegment, fetchAllEfforts, transformStravaDetailedActivity } from './strava';
import Activity from '../models/Activity';
import Segment from '../models/Segment';
import SegmentEffort from '../models/SegmentEffort';
import ActivityStreams from '../models/ActivityStreams';
import AppVariables from '../models/AppVariables';

interface DbSegmentData {
  segmentIdsNotInDb: number[];
  segmentsInDb: StravatronDetailedSegment[];
}

// summary activities
export function getSummaryActivities(request: Request, response: Response) {

  console.log('getActivities handler:');

  retrieveAccessToken()
    .then((accessToken: any) => {
      getSecondsSinceLastFetch().then((secondsSinceLastFetch) => {
        return fetchSummaryActivities(accessToken, secondsSinceLastFetch);
      }).then((summaryActivities: StravatronSummaryActivity[]) => {
        addSummaryActivitiesToDb(summaryActivities).then(() => {
          const dateOfLastActivity = getDateOfLastFetchedActivity(summaryActivities);
          console.log('dateOfLastActivity');
          console.log(dateOfLastActivity);
          setDateOfLastFetchedActivityInDb(dateOfLastActivity).then(() => {
            response.json(summaryActivities);
          });
        });
      });
    });
}

function addSummaryActivitiesToDb(summaryActivities: StravatronSummaryActivity[]): Promise<void> {

  const addNextSummaryActivity = (index: number): Promise<any> => {

    if (index >= summaryActivities.length) {
      return Promise.resolve();
    }

    const summaryActivity: StravatronSummaryActivity = summaryActivities[index];

    return Activity.create(summaryActivity)
      .then((addedActivity: any) => {
        return addNextSummaryActivity(index + 1);
      });
  };

  return addNextSummaryActivity(0);
}

function getSecondsSinceLastFetch(): Promise<any> {

  return getDateOfLastFetchedActivityFromDb().then((dateOfLastFetchedActivity: Date) => {
    console.log('Date of last fetched activity');
    console.log(dateOfLastFetchedActivity);

    let secondsSinceLastFetch = Math.floor(dateOfLastFetchedActivity.getTime() / 1000);
    if (secondsSinceLastFetch < 0) {
      secondsSinceLastFetch = 0;
    }
    return Promise.resolve(secondsSinceLastFetch);
  });
}

function getDateOfLastFetchedActivity(summaryActivities: StravatronSummaryActivity[]): Date {
  let dateOfLastFetchedActivity = new Date(1970, 0, 0, 0, 0, 0, 0);
  for (const summaryActivity of summaryActivities) {
    const activityDate = new Date(summaryActivity.startDateLocal);
    if (activityDate.getTime() > dateOfLastFetchedActivity.getTime()) {
      dateOfLastFetchedActivity = activityDate;
    }
  }
  return dateOfLastFetchedActivity;
}

// https://stackoverflow.com/questions/39153460/whats-the-difference-between-findoneandupdate-and-findoneandreplace
function setDateOfLastFetchedActivityInDb(dateOfLastFetchedActivity: Date): Promise<void> {

  const appVariables: any = {
    dateOfLastFetchedActivity,
  };

  const query = AppVariables.find({});
  const promise: Promise<Document[]> = query.exec();
  return promise.then((appVariablesDocs: Document[]) => {
    if (isArray(appVariablesDocs) && appVariablesDocs.length > 0) {
      const appVariable: Document = appVariablesDocs[0];
      (appVariable as any).dateOfLastFetchedActivity = dateOfLastFetchedActivity;
      appVariable.save();
      return Promise.resolve();
    }
    else {
      return AppVariables.create(appVariables).then(() => {
        return Promise.resolve();
      });
    }
  });
}

function isActivityInDb(activityId: string) {
  // TEDTODO
  return false;
}
// detailed activity
export function getDetailedActivity(request: Request, response: Response): Promise<any> {

  const activityId: string = request.params.id;

  // check to see if this activity already exists in the db as a detailed activity
  if (isActivityInDb(activityId)) {
    // TEDTODO
  }
  else {

    let accessToken: any;
    let detailedActivity: StravatronDetailedActivity;
    let detailedActivityAttributes: StravatronDetailedActivityAttributes;
    const segmentIds: number[] = [];
    let segments: StravatronDetailedSegment[];
    let allSegmentEffortsForSegmentsInActivity: StravatronSegmentEffort[];

    return retrieveAccessToken()

      .then((accessTokenRet: any) => {

        accessToken = accessTokenRet;
        return fetchDetailedActivity(accessToken, activityId);

      }).then((nativeDetailedActivity: StravaNativeDetailedActivity) => {

        detailedActivity = transformStravaDetailedActivity(nativeDetailedActivity);

        // retrieve all segmentEfforts and segments from the detailed activity
        for (const stravaSegmentEffort of nativeDetailedActivity.segment_efforts) {
          segmentIds.push(stravaSegmentEffort.segment.id);
        }

        // get the segments that are in the database already and fetch the
        // segments that are not in the database from strava (and add them to the db)
        return getSegments(accessToken, segmentIds);

      }).then((detailedSegmentsRet: StravatronDetailedSegment[]) => {

        segments = detailedSegmentsRet;

        const athleteId = '2843574';            // pa
        // const athleteId = '7085811';         // ma

        return getAllEffortsForAllSegments(accessToken, athleteId, segments);

      }).then((allEffortsForSegmentsInCurrentActivity) => {

        allSegmentEffortsForSegmentsInActivity = getSegmentEffortsInActivity(allEffortsForSegmentsInCurrentActivity);

        return fetchStreams(accessToken, activityId);

      }).then((streams: StravatronStream[]) => {

        const stravatronStreamData: StravatronStreams = getStreamData(streams);

        // add streams to db

        // TEDTODO - put elsewhere
        detailedActivityAttributes =
        {
          achievementCount: detailedActivity.achievementCount,
          athleteId: detailedActivity.athleteId,
          averageSpeed: detailedActivity.averageSpeed,
          averageTemp: detailedActivity.averageTemp,
          averageWatts: detailedActivity.averageWatts,
          deviceWatts: detailedActivity.deviceWatts,
          distance: detailedActivity.distance,
          elapsedTime: detailedActivity.elapsedTime,
          elevHigh: detailedActivity.elevHigh,
          elevLow: detailedActivity.elevLow,
          endLatlng: detailedActivity.endLatlng,
          id: detailedActivity.id,
          kilojoules: detailedActivity.kilojoules,
          city: detailedActivity.city,
          country: detailedActivity.country,
          state: detailedActivity.state,
          map: detailedActivity.map,
          maxSpeed: detailedActivity.maxSpeed,
          movingTime: detailedActivity.movingTime,
          name: detailedActivity.name,
          prCount: detailedActivity.prCount,
          resourceState: detailedActivity.resourceState,
          startDate: detailedActivity.startDate,
          startDateLocal: detailedActivity.startDateLocal,
          startLatitude: detailedActivity.startLatitude,
          startLatlng: detailedActivity.startLatlng,
          startLongitude: detailedActivity.startLongitude,
          timezone: detailedActivity.timezone,
          totalElevationGain: detailedActivity.totalElevationGain,
          weightedAverageWatts: detailedActivity.weightedAverageWatts,
          description: detailedActivity.description,
          calories: detailedActivity.calories,
          averageCadence: detailedActivity.averageCadence,
          averageHeartrate: detailedActivity.averageHeartrate,
          deviceName: detailedActivity.deviceName,
          hasHeartrate: detailedActivity.hasHeartrate,
          maxHeartrate: detailedActivity.maxHeartrate,
          maxWatts: detailedActivity.maxWatts,
          type: detailedActivity.type,
          utcOffset: detailedActivity.utcOffset,
          bestEfforts: detailedActivity.bestEfforts,
        };

        // merge this detailed activity data with the existing summary activity data
        return addActivityToDb(detailedActivityAttributes).then(() => {
          const detailedActivityData: StravatronDetailedActivityData = {
            detailedActivityAttributes,
            streams: stravatronStreamData,
            segments,
            allSegmentEffortsForSegmentsInActivity,
          };
          response.json(detailedActivityData);
        });
      });
  }
}

function getAllEffortsForAllSegments(accessToken: any, athleteId: string, segments: StravatronDetailedSegment[]): Promise<StravatronSegmentEffortsForSegment[]> {

  const allEffortsForSegmentsInCurrentActivity: StravatronSegmentEffortsForSegment[] = [];

  const getNextEffortsForSegment = (index: number): Promise<StravatronSegmentEffortsForSegment[]> => {

    if (index >= segments.length) {
      return Promise.resolve(allEffortsForSegmentsInCurrentActivity);
    }

    const segment: StravatronDetailedSegment = segments[index];

    // see if all efforts for this segment have already been retrieved
    if (!isNil(segment.allEffortsLoaded) && segment.allEffortsLoaded) {
      // TEDTODO - need to get the segmentEfforts and push them to allEffortsForSegmentsInCurrentActivity
      console.log('allEffortsLoaded for segment: ', segment.id);
      return getNextEffortsForSegment(index + 1);
    }

    const segmentId = segment.id;

    console.log('fetchAllEfforts for segment: ', segmentId);

    return fetchAllEfforts(accessToken, athleteId, segmentId)
      .then((segmentEffortsForSegment: StravatronSegmentEffortsForSegment) => {
        allEffortsForSegmentsInCurrentActivity.push(segmentEffortsForSegment);
        return addSegmentEffortsToDb(segmentEffortsForSegment);
      }).then( () => {
        return setSegmentEffortsLoaded(segmentId);
      }).then(() => {
        return getNextEffortsForSegment(index + 1);
      });
  };

  return getNextEffortsForSegment(0);
}

function setSegmentEffortsLoaded(segmentId: number): Promise<Document> {

  const conditions = { id: segmentId };
  const query = Segment.findOneAndUpdate(conditions, { allEffortsLoaded: true });
  const promise: Promise<Document> = query.exec();
  return promise
    .then( (segmentDocument: Document) => {
      return Promise.resolve(segmentDocument);
    });
}

function getSegments(accessToken: any, segmentIds: number[]): Promise<StravatronDetailedSegment[]> {

  let segmentsInDb: StravatronDetailedSegment[];
  let stravatronSegments: StravatronDetailedSegment[];

  return getDbSegmentData(segmentIds)
    .then((segmentData: any) => {
      segmentsInDb = segmentData.segmentsInDb;
      const segmentIdsNotInDb: number[] = segmentData.segmentIdsNotInDb;
      return getSegmentsFromStrava(accessToken, segmentIdsNotInDb);
    }).then((stravatronSegmentsRet: StravatronDetailedSegment[]) => {
      stravatronSegments = stravatronSegmentsRet;
      return addSegmentsToDb(stravatronSegments);
    }).then(() => {
      return Promise.resolve(segmentsInDb.concat(stravatronSegments));
    });
}

function getDbSegmentData(allSegmentIds: number[]): Promise<DbSegmentData> {
  // const query = Segment.find({}).where('id').select('id').in(allSegmentIds);
  const query = Segment.find({}).where('id').in(allSegmentIds);
  const promise: Promise<Document[]> = query.exec();
  return promise.then((mongooseSegmentsInDb: any) => {
    const segmentsInDb: StravatronDetailedSegment[] = mongooseSegmentsInDb.map((mongooseSegmentInDb: any) => {
      return mongooseSegmentInDb.toObject();
    });
    const segmentIdsInDb: number[] = segmentsInDb.map((segmentInDb: any) => {
      return segmentInDb.id;
    });
    const segmentIdsNotInDb: number[] = allSegmentIds.filter((value, index, arr) => {
      return segmentIdsInDb.indexOf(value) < 0;
    });
    return Promise.resolve(
      {
        segmentsInDb,
        segmentIdsNotInDb,
      },
    );
  }).catch((err: Error) => {
    return Promise.reject(err);
  });
}

function getSegmentsFromStrava(accessToken: any, segmentIds: number[]): Promise<StravatronDetailedSegment[]> {

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

      const achievements: any[] = [];
      for (const achievement of effortForSegment.achievements) {
        achievements.push({
          rank: achievement.rank,
          type: achievement.achievementType,
          typeId: achievement.typeId,
        });
      }

      const stravatronSegmentEffort: StravatronSegmentEffort = {
        id: effortForSegment.id,
        segmentId: effortForSegment.segmentId,
        name: effortForSegment.name,
        activityId: effortForSegment.activityId,
        elapsedTime: effortForSegment.elapsedTime,
        movingTime: effortForSegment.movingTime,
        startDateLocal: effortForSegment.startDateLocal,
        distance: effortForSegment.distance,
        averageWatts: effortForSegment.averageWatts,
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

function getStreamData(stravaStreams: StravatronStream[]): StravatronStreams {

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

  const streamData: StravatronStreams =
  {
    time: timeData,
    location: locationData,
    elevation: elevationData,
    distance: distanceData,
    gradient: gradientData,
    cadence: cadenceData,
    heartrate: heartrateData,
    watts: wattsData,
  };

  return streamData;
}

function addActivityToDb(detailedActivityAttributes: any) {
  return Activity.create(detailedActivityAttributes).then((activity: any) => {
    console.log('activity added to database: ' + activity);
    Promise.resolve();
  });
}

function getDateOfLastFetchedActivityFromDb(): Promise<Date> {

  const beginningOfTime = new Date(1970, 0, 0, 0, 0, 0, 0);

  const query = AppVariables.find({});
  const promise: Promise<Document[]> = query.exec();

  return promise.then((appVariablesDocs: any[]) => {
    if (isArray(appVariablesDocs) && appVariablesDocs.length > 0) {
      const appVariables: any = appVariablesDocs[0].toObject();
      const dateOfLastActivity: Date = appVariables.dateOfLastFetchedActivity;
      dateOfLastActivity.setDate(dateOfLastActivity.getDate() + 1); // given how strava treats 'dateOfLastActivity', the following shouldn't make any difference, but ....
      dateOfLastActivity.setHours(0);
      dateOfLastActivity.setMinutes(0);
      dateOfLastActivity.setSeconds(0);
      dateOfLastActivity.setMilliseconds(0);
      return Promise.resolve(appVariables.dateOfLastFetchedActivity);
    }
    else {
      return Promise.resolve(beginningOfTime);
    }
  }).catch((err: Error) => {
    console.log('getDateOfLastFetchedActivity error: ' + err);
    return Promise.resolve(beginningOfTime);
  });
}

// https://mongoosejs.com/docs/api.html#model_Model.insertMany
function addSegmentsToDb(detailedSegments: StravatronDetailedSegment[]): Promise<any> {
  if (detailedSegments.length === 0) {
    return Promise.resolve();
  }
  return Segment.collection.insertMany(
    detailedSegments,
    {
      ordered: false,
    },
  );
}

function addSegmentEffortsToDb(segmentEfforts: StravatronSegmentEffort[]): Promise<any> {
  if (segmentEfforts.length === 0) {
    return Promise.resolve();
  }
  return SegmentEffort.collection.insertMany(
    segmentEfforts,
    {
      ordered: false,
    },
  );
}

// TEST only
export function createActivity(request: Request, response: Response, next: any) {
  console.log('createActivity');
  console.log(request.body);
  Activity.create(request.body).then((activity: any) => {
    response.status(201).json({
      success: true,
      data: activity,
    });
  });
}

export function createSegment(request: Request, response: Response, next: any) {
  console.log('createSegment');
  console.log(request.body);
  Segment.create(request.body).then((segment: any) => {
    response.status(201).json({
      success: true,
      data: segment,
    });
  });
}

export function createSegmentEffort(request: Request, response: Response, next: any) {
  console.log('createSegmentEffort');
  console.log(request.body);
  SegmentEffort.create(request.body).then((segmentEffort: any) => {
    response.status(201).json({
      success: true,
      data: segmentEffort,
    });
  });
}

export function createStream(request: Request, response: Response, next: any) {
  console.log('createStream');
  // console.log(request.body);
  const bodySize = roughSizeOfObject(request.body);
  console.log('bodySize: ' + bodySize);
  ActivityStreams.create(request.body).then((activityStreams: any) => {
    response.status(201).json({
      success: true,
      data: activityStreams,
    });
  });
}

export function getStreams(request: Request, response: Response): Promise<any> {

  const activityId: string = request.params.id;

  let accessToken: any;

  return retrieveAccessToken()

    .then((accessTokenRet: any) => {

      accessToken = accessTokenRet;
      return fetchStreams(accessToken, activityId);

    }).then((streams: StravatronStream[]) => {

      const stravatronStreamData: StravatronStreams = getStreamData(streams);
      console.log(stravatronStreamData);

      return response.status(201).json({
        success: true,
        data: stravatronStreamData,
      });

    });
}

function roughSizeOfObject(object: any): number {

  const objectList = [];
  const stack = [object];
  let bytes = 0;

  while (stack.length) {
    const value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;
    }
    else if (typeof value === 'string') {
      bytes += value.length * 2;
    }
    else if (typeof value === 'number') {
      bytes += 8;
    }
    else if
      (
      typeof value === 'object'
      && objectList.indexOf(value) === -1
    ) {
      objectList.push(value);

      for (const i in value) {
        if (value[i]) {
          stack.push(value[i]);
        }
      }
    }
  }
  return bytes;
}