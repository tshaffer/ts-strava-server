import { isNil, isArray } from 'lodash';

import { Request, Response } from 'express';
import { Document } from 'mongoose';

import { fetchSummaryActivities, retrieveAccessToken, fetchDetailedActivity } from '../controllers';
import {
  StravatronDetailedActivity,
  StravatronSegmentEffort,
  StravatronDetailedActivityAttributes,
  StravatronActivityStreams,
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
          if (isNil(dateOfLastActivity)) {
            return response.json(summaryActivities);
          }
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
  
  if (summaryActivities.length === 0) {
    return null;
  }

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

function getActivityAttributes(activityId: number): Promise<StravatronDetailedActivityAttributes> {
  const query = Activity.find({ id: activityId });
  const promise: Promise<Document[]> = query.exec();
  return promise.then((activityDocs: Document[]) => {
    if (isArray(activityDocs) && activityDocs.length === 1) {
      const activityDoc: Document = activityDocs[0];
      const activityAttributes: StravatronDetailedActivityAttributes = activityDoc.toObject();
      return Promise.resolve(activityAttributes);
    }
    return Promise.resolve(null);
  });
}

function getActivitySegmentEffortsFromDb(activityId: number): Promise<StravatronSegmentEffort[]> {
  const query = SegmentEffort.find({ activityId });
  const promise: Promise<Document[]> = query.exec();
  return promise.then((segmentEffortDocs: Document[]) => {
    if (isArray(segmentEffortDocs)) {
      const segmentEfforts: StravatronSegmentEffort[] = segmentEffortDocs.map((segmentEffortDoc: Document) => {
        return segmentEffortDoc.toObject();
      });
      return Promise.resolve(segmentEfforts);
    }
    return Promise.reject();
  });
}

function getSegmentEffortsForSegmentsFromDb(segmentIds: number[]): Promise<StravatronSegmentEffortsForSegment[]> {

  const allEffortsForSegmentsInCurrentActivity: StravatronSegmentEffortsForSegment[] = [];

  const getNextEffortsForSegment = (index: number): Promise<StravatronSegmentEffortsForSegment[]> => {

    if (index >= segmentIds.length) {
      return Promise.resolve(allEffortsForSegmentsInCurrentActivity);
    }

    return getSegmentEffortsForSegmentFromDb(segmentIds[index])
      .then((segmentEffortsForSegment: StravatronSegmentEffortsForSegment) => {
        allEffortsForSegmentsInCurrentActivity.push(segmentEffortsForSegment);
        return getNextEffortsForSegment(index + 1);
      });
  };

  return getNextEffortsForSegment(0);
}

function getSegmentsFromDb(segmentIds: number[]): Promise<StravatronDetailedSegment[]> {
  const query = Segment.find({ id: { $in: segmentIds } });
  const promise: Promise<Document[]> = query.exec();
  return promise.then((segmentDocs: Document[]) => {
    if (isArray(segmentDocs)) {
      const segments: StravatronDetailedSegment[] = segmentDocs.map((segmentDoc: Document) => {
        return segmentDoc.toObject();
      });
      return Promise.resolve(segments);
    }
    return Promise.resolve([]);
  });
}

// detailed activity
export function getDetailedActivity(request: Request, response: Response): Promise<any> {

  const activityId: string = request.params.id;
  let segmentIds: number[] = [];
  let segments: StravatronDetailedSegment[];
  let allSegmentEffortsForSegmentsInActivity: StravatronSegmentEffort[];

  // check to see if this activity already exists in the db as a detailed activity
  return getActivityAttributes(Number(activityId))
    .then((activityAttributes: StravatronDetailedActivityAttributes) => {
      if (!isNil(activityAttributes) && activityAttributes.detailsLoaded) {
        // load data from db
        return getActivitySegmentEffortsFromDb(Number(activityId))
          .then((segmentEfforts: StravatronSegmentEffort[]) => {
            segmentIds = segmentEfforts.map((segmentEffort) => {
              return segmentEffort.segmentId;
            });
            return getSegmentsFromDb(segmentIds);
          }).then((segmentsRet: StravatronDetailedSegment[]) => {
            segments = segmentsRet;
            return getSegmentEffortsForSegmentsFromDb(segmentIds);
          }).then((allEffortsForSegmentsInCurrentActivity) => {
            allSegmentEffortsForSegmentsInActivity = getSegmentEffortsInActivity(allEffortsForSegmentsInCurrentActivity);
            return getStreamDataFromDb(Number(activityId));
          }).then((activityStreams: StravatronActivityStreams) => {
            const detailedActivityData: StravatronDetailedActivityData = {
              detailedActivityAttributes: activityAttributes,
              streams: activityStreams,
              segments,
              allSegmentEffortsForSegmentsInActivity,
            };
            response.json(detailedActivityData);
          });
      }
      else {
        let accessToken: any;
        let detailedActivity: StravatronDetailedActivity;
        let detailedActivityAttributes: StravatronDetailedActivityAttributes;

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

            return getAllEffortsForAllSegments(accessToken, athleteId, detailedActivity, segments);

          }).then((allEffortsForSegmentsInCurrentActivity) => {

            allSegmentEffortsForSegmentsInActivity = getSegmentEffortsInActivity(allEffortsForSegmentsInCurrentActivity);

            return fetchStreams(accessToken, activityId);

          }).then((streams: StravatronStream[]) => {

            const stravatronStreamData: StravatronActivityStreams = getStreamData(detailedActivity.id, streams);

            // add streams to db
            // TEDTODO - ignore promise return - is this correct?
            addStreamsToDb(stravatronStreamData)
              .then(() => {

                // TEDTODO - put elsewhere
                detailedActivityAttributes =
                {
                  achievementCount: detailedActivity.achievementCount,
                  athleteId: detailedActivity.athleteId,
                  averageSpeed: detailedActivity.averageSpeed,
                  averageTemp: detailedActivity.averageTemp,
                  averageWatts: detailedActivity.averageWatts,
                  detailsLoaded: false,
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
                return addActivityDetailsToDb(detailedActivityAttributes).then(() => {
                  const detailedActivityData: StravatronDetailedActivityData = {
                    detailedActivityAttributes,
                    streams: stravatronStreamData,
                    segments,
                    allSegmentEffortsForSegmentsInActivity,
                  };
                  response.json(detailedActivityData);
                });
              });

          });
      }
    });
}

function getAllEffortsForAllSegments(accessToken: any, athleteId: string, detailedActivity: StravatronDetailedActivity, segments: StravatronDetailedSegment[]): Promise<StravatronSegmentEffortsForSegment[]> {

  const allEffortsForSegmentsInCurrentActivity: StravatronSegmentEffortsForSegment[] = [];
  let segmentEffortsForSegment: StravatronSegmentEffortsForSegment;

  const getNextEffortsForSegment = (index: number): Promise<StravatronSegmentEffortsForSegment[]> => {

    if (index >= segments.length) {
      return Promise.resolve(allEffortsForSegmentsInCurrentActivity);
    }

    const segment: StravatronDetailedSegment = segments[index];

    // see if all prior efforts for this segment have already been retrieved
    // THIS ONLY WORKS IF THIS CODE IS NOT CALLED WHEN THE ACTIVITY HAS ALREADY BEEN LOADED / VIEWED
    if (!isNil(segment.allEffortsLoaded) && segment.allEffortsLoaded) {
      console.log('allEffortsLoaded for segment: ', segment.id);
      return getSegmentEffortsForSegmentFromDb(segment.id)
        .then((segmentEffortsForSegmentRet: StravatronSegmentEffortsForSegment) => {
          segmentEffortsForSegment = segmentEffortsForSegmentRet;
          return Promise.resolve(null);
          // TEDTODO - think through this some more - current algorithm isn't solid.
          // return addActivitySegmentEffortToDb(detailedActivity, segment.id);
        }).then((currentSegmentEffort: StravatronSegmentEffort) => {
          if (!isNil(currentSegmentEffort)) {
            segmentEffortsForSegment.push(currentSegmentEffort);
          }
          allEffortsForSegmentsInCurrentActivity.push(segmentEffortsForSegment);
          return getNextEffortsForSegment(index + 1);
        });
    }

    const segmentId = segment.id;

    console.log('fetchAllEfforts for segment: ', segmentId);

    return fetchAllEfforts(accessToken, athleteId, segmentId)
      .then((segmentEffortsForSegmentRet: StravatronSegmentEffortsForSegment) => {
        allEffortsForSegmentsInCurrentActivity.push(segmentEffortsForSegmentRet);
        return addSegmentEffortsToDb(segmentEffortsForSegmentRet);
      }).then(() => {
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
    .then((segmentDocument: Document) => {
      return Promise.resolve(segmentDocument);
    });
}

function getSegments(accessToken: any, segmentIds: number[]): Promise<StravatronDetailedSegment[]> {

  let segmentsInDb: StravatronDetailedSegment[];
  let stravatronSegments: StravatronDetailedSegment[];

  return getSegmentDataFromDb(segmentIds)
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

function getSegmentDataFromDb(allSegmentIds: number[]): Promise<DbSegmentData> {
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

function getSegmentEffortsForSegmentFromDb(segmentId: number): Promise<StravatronSegmentEffort[]> {
  const query = SegmentEffort.find({ segmentId });
  const promise: Promise<Document[]> = query.exec();
  return promise
    .then((segmentEffortDocuments: Document[]) => {
      const segmentEfforts: StravatronSegmentEffort[] = segmentEffortDocuments.map((segmentEffortDocument: Document) => {
        return segmentEffortDocument.toObject();
      });
      return Promise.resolve(segmentEfforts);
    });
}

// get segment effort for the current activity and add it to the db
function addActivitySegmentEffortToDb(detailedActivity: StravatronDetailedActivity, segmentId: number): Promise<StravatronSegmentEffort> {
  for (const segmentEffort of detailedActivity.segmentEfforts) {
    if (segmentEffort.segmentId === segmentId) {
      return addSegmentEffortsToDb([segmentEffort])
        .then(() => {
          return Promise.resolve(segmentEffort);
        });
    }
  }
  return Promise.reject();
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

function getStreamDataFromDb(activityId: number): Promise<StravatronActivityStreams> {
  const query = ActivityStreams.find({});
  const promise: Promise<Document[]> = query.exec();
  return promise.then((activityStreamsDocs: Document[]) => {
    if (isArray(activityStreamsDocs) && activityStreamsDocs.length > 0) {
      const activityStreams: StravatronActivityStreams = activityStreamsDocs[0].toObject();
      return Promise.resolve(activityStreams);
    }
    return Promise.resolve(null);
  });
}

export function getStreamData(activityId: number, stravaStreams: StravatronStream[]): StravatronActivityStreams {

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

  const streamData: StravatronActivityStreams =
  {
    activityId,
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

function addActivityDetailsToDb(detailedActivityAttributes: StravatronDetailedActivityAttributes): Promise<Document> {
  const conditions = { id: detailedActivityAttributes.id };
  const detailedAttributes: any = {
    detailsLoaded: true,
    description: detailedActivityAttributes.description,
    calories: detailedActivityAttributes.calories,
    averageCadence: detailedActivityAttributes.averageCadence,
    averageHeartrate: detailedActivityAttributes.averageHeartrate,
    deviceName: detailedActivityAttributes.deviceName,
    hasHeartrate: detailedActivityAttributes.hasHeartrate,
    maxHeartrate: detailedActivityAttributes.maxHeartrate,
    maxWatts: detailedActivityAttributes.maxWatts,
    type: detailedActivityAttributes.type,
    utcOffset: detailedActivityAttributes.utcOffset,
  };
  const query = Activity.findOneAndUpdate(conditions, detailedAttributes);
  const promise: Promise<Document> = query.exec();
  return promise
    .then((detailedActivity: Document) => {
      return Promise.resolve(detailedActivity);
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

function addStreamsToDb(activityStreams: StravatronActivityStreams): Promise<Document> {
  return ActivityStreams.create(activityStreams);
}
