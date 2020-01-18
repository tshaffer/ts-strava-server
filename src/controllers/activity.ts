import { isNil, isArray } from 'lodash';

import { Request, Response } from 'express';
import { Document } from 'mongoose';

import { fetchSummaryActivities, retrieveAccessToken, fetchDetailedActivity } from '../controllers';
import {
  StravatronSegmentEffort,
  StravatronActivityStreams,
  StravatronStream,
  StravatronDetailedSegment,
  StravatronSegmentEffortsForSegment,
  StravatronSummaryActivity,
  StravatronDetailedActivityData,
  StravaNativeDetailedActivity,
  ZwiftSegmentSpec,
  PowerData,
  StravatronActivity,
  StravaNativeDetailedSegmentEffort,
} from '../type';
import { fetchStreams, fetchSegment, fetchAllEfforts, transformStravaDetailedActivity } from './strava';
import Activity from '../models/Activity';
import Segment from '../models/Segment';
import SegmentEffort from '../models/SegmentEffort';
import ActivityStreams from '../models/ActivityStreams';
import AppVariables from '../models/AppVariables';
import ZwiftSegment from '../models/ZwiftSegment';
import { getPowerData, getMmpData } from '../utilities';

interface DbSegmentData {
  segmentIdsNotInDb: number[];
  segmentsInDb: StravatronDetailedSegment[];
}

// gets activities
//    first retrieves activites from db (these may or may not include detailed attributes)
//    then retrieves any activities from strava that are newer than the ones in the db

export function getActivities(request: Request, response: Response) {

  console.log('getActivities handler:');

  return getActivitiesFromDb()
    .then((dbActivities: StravatronActivity[]) => {
      retrieveAccessToken()
        .then((accessToken: any) => {
          getSecondsSinceLastFetch().then((secondsSinceLastFetch) => {
            return fetchSummaryActivities(accessToken, secondsSinceLastFetch);
          }).then((summaryActivities: StravatronSummaryActivity[]) => {
            addSummaryActivitiesToDb(summaryActivities).then(() => {
              const dateOfLastActivity = getDateOfLastFetchedActivity(summaryActivities);
              const activities: StravatronActivity[] = (summaryActivities as StravatronActivity[]).concat(dbActivities);
              if (isNil(dateOfLastActivity)) {
                return response.json(activities);
              }
              console.log('dateOfLastActivity');
              console.log(dateOfLastActivity);
              setDateOfLastFetchedActivityInDb(dateOfLastActivity).then(() => {
                response.json(activities);
              });
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

function getActivitiesFromDb(): Promise<StravatronActivity[]> {
  const query = Activity.find({});
  const promise: Promise<Document[]> = query.exec();
  return promise.then((activityDocs: Document[]) => {
    const activities: StravatronActivity[] = activityDocs.map((activityDoc: Document) => {
      return activityDoc.toObject();
    });
    return Promise.resolve(activities);
  });
}

function getActivityAttributes(activityId: number): Promise<StravatronActivity> {
  const query = Activity.find({ id: activityId });
  const promise: Promise<Document[]> = query.exec();
  return promise.then((activityDocs: Document[]) => {
    if (isArray(activityDocs) && activityDocs.length === 1) {
      const activityDoc: Document = activityDocs[0];
      const activityAttributes: StravatronActivity = activityDoc.toObject();
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

export function getMeanMaximalPowerData(request: Request, response: Response): Promise<any> {

  const activityId: string = request.params.id;

  return getStreamDataFromDb(Number(activityId))
    .then( (streams: StravatronActivityStreams) => {
      const watts: number[] = streams.watts;
      getMmpData(watts);
      return response.json({status: 'ok'});
    });
}

// force reload efforts for an activity
export function reloadEfforts(request: Request, response: Response): Promise<any> {

  let accessToken: string;

  const activityId: string = request.params.id;
  // let activity: StravatronActivity;
  let segmentIds: number[] = [];
  let segments: StravatronDetailedSegment[];
  let allSegmentEffortsForSegmentsInActivity: StravatronSegmentEffort[];

  return retrieveAccessToken()
    .then((accessTokenRet: any) => {
      accessToken = accessTokenRet;
      return fetchDetailedActivity(accessToken, activityId);
    }).then((nativeDetailedActivity: StravaNativeDetailedActivity) => {
      segmentIds = nativeDetailedActivity.segment_efforts.map((nativeDetailedSegmentEffort: StravaNativeDetailedSegmentEffort) => {
        return nativeDetailedSegmentEffort.segment.id;
      });
      if (nativeDetailedActivity.type === 'VirtualRide') {
        return getZwiftSegmentIds()
          .then((zwiftSegmentIds: number[]) => {
            const zwiftSegmentIdsInActivity: number[] = segmentIds.filter((value, index, arr) => {
              return zwiftSegmentIds.indexOf(value) > 0;
            });
            console.log(zwiftSegmentIdsInActivity);
            return Promise.resolve(zwiftSegmentIdsInActivity);
          });
      }
      else {
        return Promise.resolve(segmentIds);
      }

    }).then((segmentIdsRet: number[]) => {

      segmentIds = segmentIdsRet;

      return getSegments(accessToken, segmentIdsRet);

    }).then((detailedSegmentsRet: StravatronDetailedSegment[]) => {

      segments = detailedSegmentsRet;

      const athleteId = '2843574';            // pa
      // const athleteId = '7085811';         // ma

      return getAllEffortsForAllSegments(accessToken, athleteId, true, segments);

    }).then((allEffortsForSegmentsInCurrentActivity) => {

      allSegmentEffortsForSegmentsInActivity = getSegmentEffortsInActivity(allEffortsForSegmentsInCurrentActivity);
      return getStreamDataFromDb(Number(activityId));

    }).then((stravatronStreamData: StravatronActivityStreams) => {

      // TEDTODO - note that this code is currently only updating the power data for the segment efforts for the current activity
      for (const segmentEffort of allSegmentEffortsForSegmentsInActivity) {
        if (segmentEffort.activityId === Number(activityId) && !isNil(segmentEffort.startIndex) && !isNil(segmentEffort.endIndex)) {
          const segmentEffortPowerData: PowerData = getPowerData(181, segmentEffort.startIndex, segmentEffort.endIndex, stravatronStreamData.time, stravatronStreamData.watts);
          segmentEffort.normalizedPower = segmentEffortPowerData.normalizedPower;
          segmentEffort.intensityFactor = segmentEffortPowerData.intensityFactor;
          segmentEffort.trainingStressScore = segmentEffort.trainingStressScore;
          addSegmentEffortPowerToDb(segmentEffort.id, segmentEffortPowerData.normalizedPower, segmentEffortPowerData.intensityFactor, segmentEffortPowerData.trainingStressScore)
            .then((segmentEffortDoc) => {
              console.log('addSegmentEffortPower promised resolved:');
              console.log(segmentEffortDoc);
            });
        }
      }
      response.json(allSegmentEffortsForSegmentsInActivity);
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
    .then((activityAttributes: StravatronActivity) => {
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
        // fetch activity from strava
        let accessToken: any;
        let detailedActivity: StravatronActivity;

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

            if (detailedActivity.type === 'VirtualRide') {
              return getZwiftSegmentIds()
                .then((zwiftSegmentIds: number[]) => {
                  const zwiftSegmentIdsInActivity: number[] = segmentIds.filter((value, index, arr) => {
                    return zwiftSegmentIds.indexOf(value) > 0;
                  });
                  console.log(zwiftSegmentIdsInActivity);
                  return Promise.resolve(zwiftSegmentIdsInActivity);
                });
            }
            else {
              return Promise.resolve(segmentIds);
            }

          }).then((ids: number[]) => {

            segmentIds = ids;

            // get the segments that are in the database already and fetch the
            // segments that are not in the database from strava (and add them to the db)
            return getSegments(accessToken, ids);

          }).then((detailedSegmentsRet: StravatronDetailedSegment[]) => {

            segments = detailedSegmentsRet;

            const athleteId = '2843574';            // pa
            // const athleteId = '7085811';         // ma

            return getAllEffortsForAllSegments(accessToken, athleteId, false, segments);

          }).then((allEffortsForSegmentsInCurrentActivity) => {

            allSegmentEffortsForSegmentsInActivity = getSegmentEffortsInActivity(allEffortsForSegmentsInCurrentActivity);

            return fetchStreams(accessToken, activityId);

          }).then((streams: StravatronStream[]) => {

            const stravatronStreamData: StravatronActivityStreams = getStreamData(detailedActivity.id, streams);

            // retrieve power data for entire ride
            const ridePowerData: PowerData = getPowerData(181, 0, stravatronStreamData.time.length - 1, stravatronStreamData.time, stravatronStreamData.watts);

            // required information
            //    segmentIds (represents the segments that were ridden for this activity which I'm interested in)
            //    segmentEfforts - the ones for this activity that correspond to the segmentIds (above)
            // add streams to db
            // TEDTODO - ignore promise return - is this correct?
            for (const segmentEffort of allSegmentEffortsForSegmentsInActivity) {
              if (segmentEffort.activityId === detailedActivity.id && !isNil(segmentEffort.startIndex) && !isNil(segmentEffort.endIndex)) {
                const segmentEffortPowerData: PowerData = getPowerData(181, segmentEffort.startIndex, segmentEffort.endIndex, stravatronStreamData.time, stravatronStreamData.watts);
                addSegmentEffortPowerToDb(segmentEffort.id, segmentEffortPowerData.normalizedPower, segmentEffortPowerData.intensityFactor, segmentEffortPowerData.trainingStressScore)
                  .then((segmentEffortDoc) => {
                    console.log('addSegmentEffortPower promised resolved:');
                    console.log(segmentEffortDoc);
                  });
              }
            }
            console.log('allSegmentEffortsForSegmentsInActivity');
            console.log(allSegmentEffortsForSegmentsInActivity);
            addStreamsToDb(stravatronStreamData)
              .then(() => {

                detailedActivity.detailsLoaded = false;
                detailedActivity.normalizedPower = ridePowerData.normalizedPower;
                detailedActivity.intensityFactor = ridePowerData.intensityFactor;
                detailedActivity.trainingStressScore = ridePowerData.trainingStressScore;

                // merge this detailed activity data with the existing summary activity data
                return addActivityDetailsToDb(detailedActivity).then(() => {
                  const detailedActivityData: StravatronDetailedActivityData = {
                    detailedActivityAttributes: detailedActivity,
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

function getAllEffortsForAllSegments(accessToken: any, athleteId: string, forceReload: boolean, segments: StravatronDetailedSegment[]): Promise<StravatronSegmentEffortsForSegment[]> {

  const allEffortsForSegmentsInCurrentActivity: StravatronSegmentEffortsForSegment[] = [];
  let segmentEffortsForSegment: StravatronSegmentEffortsForSegment;

  const getNextEffortsForSegment = (index: number): Promise<StravatronSegmentEffortsForSegment[]> => {

    if (index >= segments.length) {
      return Promise.resolve(allEffortsForSegmentsInCurrentActivity);
    }

    const segment: StravatronDetailedSegment = segments[index];

    // see if all prior efforts for this segment have already been retrieved
    // THIS ONLY WORKS IF THIS CODE IS NOT CALLED WHEN THE ACTIVITY HAS ALREADY BEEN LOADED / VIEWED
    if (!isNil(segment.allEffortsLoaded) && segment.allEffortsLoaded && !forceReload) {
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

function addSegmentEffortPowerToDb(
  segmentEffortId: number, normalizedPower: number, intensityFactor: number, trainingStressScore: number): Promise<Document> {
  const conditions = { id: segmentEffortId };
  const query = SegmentEffort.findOneAndUpdate(conditions, {
    allEffortsLoaded: true,
    normalizedPower,
    intensityFactor,
    trainingStressScore,
  });
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

function getZwiftSegmentIds(): Promise<number[]> {
  const query = ZwiftSegment.find({});
  const promise: Promise<Document[]> = query.exec();
  return promise
    .then((zwiftSegmentDocs: Document[]) => {
      const zwiftSegmentIds: number[] = zwiftSegmentDocs.map((zwiftSegmentDoc: Document) => {
        return (zwiftSegmentDoc.toObject() as ZwiftSegmentSpec).id;
      });
      return Promise.resolve(zwiftSegmentIds);
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
// function addActivitySegmentEffortToDb(detailedActivity: StravatronActivity, segmentId: number): Promise<StravatronSegmentEffort> {
//   for (const segmentEffort of detailedActivity.segmentEfforts) {
//     if (segmentEffort.segmentId === segmentId) {
//       return addSegmentEffortsToDb([segmentEffort])
//         .then(() => {
//           return Promise.resolve(segmentEffort);
//         });
//     }
//   }
//   return Promise.reject();
// }

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
    for (const effortForSegment of allEffortsForSegment) {
      segmentEffortsInActivity.push(effortForSegment);
    }
  }
  return segmentEffortsInActivity;
}

function getStreamDataFromDb(activityId: number): Promise<StravatronActivityStreams> {
  const query = ActivityStreams.find({ activityId });
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

function addActivityDetailsToDb(detailedActivityAttributes: StravatronActivity): Promise<Document> {
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
    normalizedPower: detailedActivityAttributes.normalizedPower,
    intensityFactor: detailedActivityAttributes.intensityFactor,
    trainingStressScore: detailedActivityAttributes.trainingStressScore,
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
  ).then(() => {
    return Promise.resolve();
  }).catch((err: any) => {
    if (!isNil(err.code) && err.code === 11000) {
      console.log('addSegmentsToDb: duplicate key error');
      return Promise.resolve();
    }
    else {
      throw (err);
    }
  });
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
  ).then(() => {
    return Promise.resolve();
  }).catch((err: any) => {
    if (!isNil(err.code) && err.code === 11000) {
      console.log('addSegmentsToDb: duplicate key error');
      return Promise.resolve();
    }
    else {
      throw (err);
    }
  });
}

function addStreamsToDb(activityStreams: StravatronActivityStreams): Promise<Document | void> {
  return ActivityStreams.create(activityStreams)
    .then((doc) => {
      return Promise.resolve(doc);
    }).catch((err: any) => {
      if (!isNil(err.code) && err.code === 11000) {
        console.log('addStreamsToDb: duplicate key error');
        return Promise.resolve();
      }
      else {
        throw (err);
      }
    });
}
