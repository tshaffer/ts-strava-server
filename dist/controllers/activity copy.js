"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const lodash_1 = require("lodash");
const controllers_1 = require("../controllers");
const strava_1 = require("./strava");
const Activity_1 = __importDefault(require("../models/Activity"));
const Segment_1 = __importDefault(require("../models/Segment"));
const SegmentEffort_1 = __importDefault(require("../models/SegmentEffort"));
const ActivityStreams_1 = __importDefault(require("../models/ActivityStreams"));
const AppVariables_1 = __importDefault(require("../models/AppVariables"));
const ZwiftSegment_1 = __importDefault(require("../models/ZwiftSegment"));
const utilities_1 = require("../utilities");
// gets activities
//    first retrieves activites from db (these may or may not include detailed attributes)
//    then retrieves any activities from strava that are newer than the ones in the db
function getActivities(request, response) {
    console.log('getActivities handler:');
    return getActivitiesFromDb()
        .then((dbActivities) => {
        controllers_1.retrieveAccessToken()
            .then((accessToken) => {
            getSecondsSinceLastFetch().then((secondsSinceLastFetch) => {
                return controllers_1.fetchSummaryActivities(accessToken, secondsSinceLastFetch);
            }).then((summaryActivities) => {
                addSummaryActivitiesToDb(summaryActivities).then(() => {
                    const dateOfLastActivity = getDateOfLastFetchedActivity(summaryActivities);
                    const activities = summaryActivities.concat(dbActivities);
                    if (lodash_1.isNil(dateOfLastActivity)) {
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
exports.getActivities = getActivities;
function addSummaryActivitiesToDb(summaryActivities) {
    const addNextSummaryActivity = (index) => {
        if (index >= summaryActivities.length) {
            return Promise.resolve();
        }
        const summaryActivity = summaryActivities[index];
        return Activity_1.default.create(summaryActivity)
            .then((addedActivity) => {
            return addNextSummaryActivity(index + 1);
        }).catch((err) => {
            if (!lodash_1.isNil(err.code) && err.code === 11000) {
                console.log('addSummaryActivitiesToDb: duplicate key error');
                return addNextSummaryActivity(index + 1);
            }
            else {
                throw (err);
            }
        });
    };
    return addNextSummaryActivity(0);
}
function getSecondsSinceLastFetch() {
    return getDateOfLastFetchedActivityFromDb().then((dateOfLastFetchedActivity) => {
        console.log('Date of last fetched activity');
        console.log(dateOfLastFetchedActivity);
        let secondsSinceLastFetch = Math.floor(dateOfLastFetchedActivity.getTime() / 1000);
        if (secondsSinceLastFetch < 0) {
            secondsSinceLastFetch = 0;
        }
        return Promise.resolve(secondsSinceLastFetch);
    });
}
function getDateOfLastFetchedActivity(summaryActivities) {
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
function setDateOfLastFetchedActivityInDb(dateOfLastFetchedActivity) {
    const appVariables = {
        dateOfLastFetchedActivity,
    };
    const query = AppVariables_1.default.find({});
    const promise = query.exec();
    return promise.then((appVariablesDocs) => {
        if (lodash_1.isArray(appVariablesDocs) && appVariablesDocs.length > 0) {
            const appVariable = appVariablesDocs[0];
            appVariable.dateOfLastFetchedActivity = dateOfLastFetchedActivity;
            appVariable.save();
            return Promise.resolve();
        }
        else {
            return AppVariables_1.default.create(appVariables).then(() => {
                return Promise.resolve();
            });
        }
    });
}
function getActivitiesFromDb() {
    const query = Activity_1.default.find({});
    const promise = query.exec();
    return promise.then((activityDocs) => {
        const activities = activityDocs.map((activityDoc) => {
            return activityDoc.toObject();
        });
        return Promise.resolve(activities);
    });
}
function getActivityAttributes(activityId) {
    const query = Activity_1.default.find({ id: activityId });
    const promise = query.exec();
    return promise.then((activityDocs) => {
        if (lodash_1.isArray(activityDocs) && activityDocs.length === 1) {
            const activityDoc = activityDocs[0];
            const activityAttributes = activityDoc.toObject();
            return Promise.resolve(activityAttributes);
        }
        return Promise.resolve(null);
    });
}
function getActivitySegmentEffortsFromDb(activityId) {
    const query = SegmentEffort_1.default.find({ activityId });
    const promise = query.exec();
    return promise.then((segmentEffortDocs) => {
        if (lodash_1.isArray(segmentEffortDocs)) {
            const segmentEfforts = segmentEffortDocs.map((segmentEffortDoc) => {
                return segmentEffortDoc.toObject();
            });
            return Promise.resolve(segmentEfforts);
        }
        return Promise.reject();
    });
}
function getSegmentEffortsForSegmentsFromDb(segmentIds) {
    const allEffortsForSegmentsInCurrentActivity = [];
    const getNextEffortsForSegment = (index) => {
        if (index >= segmentIds.length) {
            return Promise.resolve(allEffortsForSegmentsInCurrentActivity);
        }
        return getSegmentEffortsForSegmentFromDb(segmentIds[index])
            .then((segmentEffortsForSegment) => {
            allEffortsForSegmentsInCurrentActivity.push(segmentEffortsForSegment);
            return getNextEffortsForSegment(index + 1);
        });
    };
    return getNextEffortsForSegment(0);
}
function getSegmentsFromDb(segmentIds) {
    const query = Segment_1.default.find({ id: { $in: segmentIds } });
    const promise = query.exec();
    return promise.then((segmentDocs) => {
        if (lodash_1.isArray(segmentDocs)) {
            const segments = segmentDocs.map((segmentDoc) => {
                return segmentDoc.toObject();
            });
            return Promise.resolve(segments);
        }
        return Promise.resolve([]);
    });
}
// force reload efforts for an activity
function reloadEfforts(request, response) {
    let accessToken;
    const activityId = request.params.id;
    // let activity: StravatronActivity;
    let segmentIds = [];
    let segments;
    let allSegmentEffortsForSegmentsInActivity;
    return controllers_1.retrieveAccessToken()
        .then((accessTokenRet) => {
        accessToken = accessTokenRet;
        return controllers_1.fetchDetailedActivity(accessToken, activityId);
    }).then((nativeDetailedActivity) => {
        segmentIds = nativeDetailedActivity.segment_efforts.map((nativeDetailedSegmentEffort) => {
            return nativeDetailedSegmentEffort.segment.id;
        });
        if (nativeDetailedActivity.type === 'VirtualRide') {
            return getZwiftSegmentIds()
                .then((zwiftSegmentIds) => {
                const zwiftSegmentIdsInActivity = segmentIds.filter((value, index, arr) => {
                    return zwiftSegmentIds.indexOf(value) > 0;
                });
                console.log(zwiftSegmentIdsInActivity);
                return Promise.resolve(zwiftSegmentIdsInActivity);
            });
        }
        else {
            return Promise.resolve(segmentIds);
        }
    }).then((segmentIdsRet) => {
        segmentIds = segmentIdsRet;
        return getSegments(accessToken, segmentIdsRet);
    }).then((detailedSegmentsRet) => {
        segments = detailedSegmentsRet;
        const athleteId = '2843574'; // pa
        // const athleteId = '7085811';         // ma
        return getAllEffortsForAllSegments(accessToken, athleteId, true, segments);
    }).then((allEffortsForSegmentsInCurrentActivity) => {
        allSegmentEffortsForSegmentsInActivity = getSegmentEffortsInActivity(allEffortsForSegmentsInCurrentActivity);
        return getStreamDataFromDb(Number(activityId));
    }).then((stravatronStreamData) => {
        // TEDTODO - note that this code is currently only updating the power data for the segment efforts for the current activity
        for (const segmentEffort of allSegmentEffortsForSegmentsInActivity) {
            if (segmentEffort.activityId === Number(activityId) && !lodash_1.isNil(segmentEffort.startIndex) && !lodash_1.isNil(segmentEffort.endIndex)) {
                const segmentEffortPowerData = utilities_1.getPowerData(181, segmentEffort.startIndex, segmentEffort.endIndex, stravatronStreamData.time, stravatronStreamData.watts);
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
exports.reloadEfforts = reloadEfforts;
// detailed activity
function getDetailedActivity(request, response) {
    const activityId = request.params.id;
    let nativeDetailedActivity;
    let segmentIds = [];
    let taggedSegmentIds = [];
    let segments;
    let allSegmentEffortsForSegmentsInActivity;
    // check to see if this activity already exists in the db as a detailed activity
    return getActivityAttributes(Number(activityId))
        .then((activityAttributes) => {
        if (!lodash_1.isNil(activityAttributes) && activityAttributes.detailsLoaded) {
            // load data from db
            return getActivitySegmentEffortsFromDb(Number(activityId))
                .then((segmentEfforts) => {
                segmentIds = segmentEfforts.map((segmentEffort) => {
                    return segmentEffort.segmentId;
                });
                return getSegmentsFromDb(segmentIds);
            }).then((segmentsRet) => {
                segments = segmentsRet;
                return getSegmentEffortsForSegmentsFromDb(segmentIds);
            }).then((allEffortsForSegmentsInCurrentActivity) => {
                allSegmentEffortsForSegmentsInActivity = getSegmentEffortsInActivity(allEffortsForSegmentsInCurrentActivity);
                return getStreamDataFromDb(Number(activityId));
            }).then((activityStreams) => {
                const detailedActivityData = {
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
            let accessToken;
            let detailedActivity;
            return controllers_1.retrieveAccessToken()
                .then((accessTokenRet) => {
                accessToken = accessTokenRet;
                return controllers_1.fetchDetailedActivity(accessToken, activityId);
            }).then((nda) => {
                nativeDetailedActivity = nda;
                detailedActivity = strava_1.transformStravaDetailedActivity(nativeDetailedActivity);
                // retrieve all segmentEfforts and segments from the detailed activity
                for (const stravaSegmentEffort of nativeDetailedActivity.segment_efforts) {
                    segmentIds.push(stravaSegmentEffort.segment.id);
                }
                const reloadEffortSegmentIds = nativeDetailedActivity.segment_efforts.map((nativeDetailedSegmentEffort) => {
                    return nativeDetailedSegmentEffort.segment.id;
                });
                console.log(segmentIds);
                console.log(reloadEffortSegmentIds);
                debugger;
                if (detailedActivity.type === 'VirtualRide') {
                    return getZwiftSegmentIds()
                        .then((zwiftSegmentIds) => {
                        const zwiftSegmentIdsInActivity = segmentIds.filter((value, index, arr) => {
                            return zwiftSegmentIds.indexOf(value) > 0;
                        });
                        console.log(zwiftSegmentIdsInActivity);
                        return Promise.resolve(zwiftSegmentIdsInActivity);
                    });
                }
                else {
                    return Promise.resolve(segmentIds);
                }
            }).then((segmentIdsRet) => {
                segmentIds = segmentIdsRet;
                return getSegments(accessToken, segmentIdsRet);
            }).then((detailedSegmentsRet) => {
                segments = detailedSegmentsRet;
                const athleteId = '2843574'; // pa
                // const athleteId = '7085811';         // ma
                return getAllEffortsForAllSegments(accessToken, athleteId, true, segments);
            }).then((allEffortsForSegmentsInCurrentActivity) => {
                allSegmentEffortsForSegmentsInActivity = getSegmentEffortsInActivity(allEffortsForSegmentsInCurrentActivity);
                return getStreamDataFromDb(Number(activityId));
            }).then((stravatronStreamData) => {
                // TEDTODO - note that this code is currently only updating the power data for the segment efforts for the current activity
                for (const segmentEffort of allSegmentEffortsForSegmentsInActivity) {
                    if (segmentEffort.activityId === Number(activityId) && !lodash_1.isNil(segmentEffort.startIndex) && !lodash_1.isNil(segmentEffort.endIndex)) {
                        const segmentEffortPowerData = utilities_1.getPowerData(181, segmentEffort.startIndex, segmentEffort.endIndex, stravatronStreamData.time, stravatronStreamData.watts);
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
        /* previous code
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
        */
    }).then((tSegmentIds) => {
        taggedSegmentIds = tSegmentIds;
        const taggedSegmentEfforts = [];
        for (const stravaNativeDetailedSegmentEffort of nativeDetailedActivity.segment_efforts) {
            const index = taggedSegmentIds.indexOf(stravaNativeDetailedSegmentEffort.segment.id);
            if (index >= 0) {
                taggedSegmentEfforts.push(strava_1.transformStravaDetailedSegmentEffort(stravaNativeDetailedSegmentEffort));
            }
        }
        console.log(taggedSegmentEfforts);
        return addSegmentEffortsToDb(taggedSegmentEfforts);
    }).then(() => {
        return getSegmentEffortsForSegmentsFromDb(taggedSegmentIds);
    }).then((allEffortsForSegmentsInCurrentActivity) => {
        allSegmentEffortsForSegmentsInActivity = getSegmentEffortsInActivity(allEffortsForSegmentsInCurrentActivity);
        return strava_1.fetchStreams(accessToken, activityId);
    }).then((streams) => {
        const stravatronStreamData = getStreamData(detailedActivity.id, streams);
        // retrieve power data for entire ride
        const ridePowerData = utilities_1.getPowerData(181, 0, stravatronStreamData.time.length - 1, stravatronStreamData.time, stravatronStreamData.watts);
        // required information
        //    segmentIds (represents the segments that were ridden for this activity which I'm interested in)
        //    segmentEfforts - the ones for this activity that correspond to the segmentIds (above)
        // add streams to db
        // TEDTODO - ignore promise return - is this correct?
        for (const segmentEffort of allSegmentEffortsForSegmentsInActivity) {
            if (segmentEffort.activityId === detailedActivity.id && !lodash_1.isNil(segmentEffort.startIndex) && !lodash_1.isNil(segmentEffort.endIndex)) {
                const segmentEffortPowerData = utilities_1.getPowerData(181, segmentEffort.startIndex, segmentEffort.endIndex, stravatronStreamData.time, stravatronStreamData.watts);
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
                const detailedActivityData = {
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
exports.getDetailedActivity = getDetailedActivity;
;
// for each segment in segments, get all the associated segmentEfforts
// do this by getting all the segmentEfforts for all the segments that are already in the database
// then, get the segmentEfforts for all the segments in the current activity - add these to the db
function getAllEffortsForAllSegments(accessToken, athleteId, forceReload, segments) {
    const allEffortsForSegmentsInCurrentActivity = [];
    let segmentEffortsForSegment;
    const getNextEffortsForSegment = (index) => {
        if (index >= segments.length) {
            return Promise.resolve(allEffortsForSegmentsInCurrentActivity);
        }
        const segment = segments[index];
        // return getSegmentEffortsForSegmentFromDb(segment.id)
        //   .then((segmentEffortsForSegmentRet: StravatronSegmentEffortsForSegment) => {
        //     segmentEffortsForSegment = segmentEffortsForSegmentRet;
        //   }).then(() => {
        //   }).then(() => {
        //     return getNextEffortsForSegment(index + 1);
        //   });
        // see if all prior efforts for this segment have already been retrieved
        // THIS ONLY WORKS IF THIS CODE IS NOT CALLED WHEN THE ACTIVITY HAS ALREADY BEEN LOADED / VIEWED
        if (!lodash_1.isNil(segment.allEffortsLoaded) && segment.allEffortsLoaded && !forceReload) {
            console.log('allEffortsLoaded for segment: ', segment.id);
            return getSegmentEffortsForSegmentFromDb(segment.id)
                .then((segmentEffortsForSegmentRet) => {
                segmentEffortsForSegment = segmentEffortsForSegmentRet;
                return Promise.resolve(null);
                // TEDTODO - think through this some more - current algorithm isn't solid.
                // return addActivitySegmentEffortToDb(detailedActivity, segment.id);
            }).then((currentSegmentEffort) => {
                if (!lodash_1.isNil(currentSegmentEffort)) {
                    segmentEffortsForSegment.push(currentSegmentEffort);
                }
                allEffortsForSegmentsInCurrentActivity.push(segmentEffortsForSegment);
                return getNextEffortsForSegment(index + 1);
            });
        }
        const segmentId = segment.id;
        console.log('fetchAllEfforts for segment: ', segmentId);
        return strava_1.fetchAllEfforts(accessToken, athleteId, segmentId)
            .then((segmentEffortsForSegmentRet) => {
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
function setSegmentEffortsLoaded(segmentId) {
    const conditions = { id: segmentId };
    const query = Segment_1.default.findOneAndUpdate(conditions, { allEffortsLoaded: true });
    const promise = query.exec();
    return promise
        .then((segmentDocument) => {
        return Promise.resolve(segmentDocument);
    });
}
function addSegmentEffortPowerToDb(segmentEffortId, normalizedPower, intensityFactor, trainingStressScore) {
    const conditions = { id: segmentEffortId };
    const query = SegmentEffort_1.default.findOneAndUpdate(conditions, {
        allEffortsLoaded: true,
        normalizedPower,
        intensityFactor,
        trainingStressScore,
    });
    const promise = query.exec();
    return promise
        .then((segmentDocument) => {
        return Promise.resolve(segmentDocument);
    });
}
function getSegments(accessToken, segmentIds) {
    let segmentsInDb;
    let stravatronSegments;
    return getSegmentDataFromDb(segmentIds)
        .then((segmentData) => {
        segmentsInDb = segmentData.segmentsInDb;
        const segmentIdsNotInDb = segmentData.segmentIdsNotInDb;
        return getSegmentsFromStrava(accessToken, segmentIdsNotInDb);
    }).then((stravatronSegmentsRet) => {
        stravatronSegments = stravatronSegmentsRet;
        return addSegmentsToDb(stravatronSegments);
    }).then(() => {
        return Promise.resolve(segmentsInDb.concat(stravatronSegments));
    });
}
function getSegmentDataFromDb(allSegmentIds) {
    // const query = Segment.find({}).where('id').select('id').in(allSegmentIds);
    const query = Segment_1.default.find({}).where('id').in(allSegmentIds);
    const promise = query.exec();
    return promise.then((mongooseSegmentsInDb) => {
        const segmentsInDb = mongooseSegmentsInDb.map((mongooseSegmentInDb) => {
            return mongooseSegmentInDb.toObject();
        });
        const segmentIdsInDb = segmentsInDb.map((segmentInDb) => {
            return segmentInDb.id;
        });
        const segmentIdsNotInDb = allSegmentIds.filter((value, index, arr) => {
            return segmentIdsInDb.indexOf(value) < 0;
        });
        return Promise.resolve({
            segmentsInDb,
            segmentIdsNotInDb,
        });
    }).catch((err) => {
        return Promise.reject(err);
    });
}
function getZwiftSegmentIds() {
    const query = ZwiftSegment_1.default.find({});
    const promise = query.exec();
    return promise
        .then((zwiftSegmentDocs) => {
        const zwiftSegmentIds = zwiftSegmentDocs.map((zwiftSegmentDoc) => {
            return zwiftSegmentDoc.toObject().id;
        });
        return Promise.resolve(zwiftSegmentIds);
    });
}
function getSegmentEffortsForSegmentFromDb(segmentId) {
    const query = SegmentEffort_1.default.find({ segmentId });
    const promise = query.exec();
    return promise
        .then((segmentEffortDocuments) => {
        const segmentEfforts = segmentEffortDocuments.map((segmentEffortDocument) => {
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
function getSegmentsFromStrava(accessToken, segmentIds) {
    const detailedSegments = [];
    const getNextSegment = (index) => {
        if (index >= segmentIds.length) {
            return Promise.resolve(detailedSegments);
        }
        const segmentId = segmentIds[index];
        return strava_1.fetchSegment(accessToken, segmentId)
            .then((detailedSegment) => {
            detailedSegments.push(detailedSegment);
            return getNextSegment(index + 1);
        });
    };
    return getNextSegment(0);
}
function getSegmentEffortsInActivity(allEffortsForSegmentsInCurrentActivity) {
    const segmentEffortsInActivity = [];
    for (const allEffortsForSegment of allEffortsForSegmentsInCurrentActivity) {
        for (const effortForSegment of allEffortsForSegment) {
            segmentEffortsInActivity.push(effortForSegment);
        }
    }
    return segmentEffortsInActivity;
}
function getStreamDataFromDb(activityId) {
    const query = ActivityStreams_1.default.find({ activityId });
    const promise = query.exec();
    return promise.then((activityStreamsDocs) => {
        if (lodash_1.isArray(activityStreamsDocs) && activityStreamsDocs.length > 0) {
            const activityStreams = activityStreamsDocs[0].toObject();
            return Promise.resolve(activityStreams);
        }
        return Promise.resolve(null);
    });
}
function getStreamData(activityId, stravaStreams) {
    let timeData;
    let locationData;
    let elevationData;
    let distanceData;
    let gradientData;
    let cadenceData;
    let heartrateData;
    let wattsData;
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
    const streamData = {
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
exports.getStreamData = getStreamData;
function addActivityDetailsToDb(detailedActivityAttributes) {
    const conditions = { id: detailedActivityAttributes.id };
    const detailedAttributes = {
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
    const query = Activity_1.default.findOneAndUpdate(conditions, detailedAttributes);
    const promise = query.exec();
    return promise
        .then((detailedActivity) => {
        return Promise.resolve(detailedActivity);
    });
}
function getDateOfLastFetchedActivityFromDb() {
    const beginningOfTime = new Date(1970, 0, 0, 0, 0, 0, 0);
    const query = AppVariables_1.default.find({});
    const promise = query.exec();
    return promise.then((appVariablesDocs) => {
        if (lodash_1.isArray(appVariablesDocs) && appVariablesDocs.length > 0) {
            const appVariables = appVariablesDocs[0].toObject();
            const dateOfLastActivity = appVariables.dateOfLastFetchedActivity;
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
    }).catch((err) => {
        console.log('getDateOfLastFetchedActivity error: ' + err);
        return Promise.resolve(beginningOfTime);
    });
}
// https://mongoosejs.com/docs/api.html#model_Model.insertMany
function addSegmentsToDb(detailedSegments) {
    if (detailedSegments.length === 0) {
        return Promise.resolve();
    }
    return Segment_1.default.collection.insertMany(detailedSegments, {
        ordered: false,
    }).then(() => {
        return Promise.resolve();
    }).catch((err) => {
        if (!lodash_1.isNil(err.code) && err.code === 11000) {
            console.log('addSegmentsToDb: duplicate key error');
            return Promise.resolve();
        }
        else {
            throw (err);
        }
    });
}
function addSegmentEffortsToDb(segmentEfforts) {
    if (segmentEfforts.length === 0) {
        return Promise.resolve();
    }
    return SegmentEffort_1.default.collection.insertMany(segmentEfforts, {
        ordered: false,
    }).then(() => {
        return Promise.resolve();
    }).catch((err) => {
        if (!lodash_1.isNil(err.code) && err.code === 11000) {
            console.log('addSegmentEffortsToDb: duplicate key error');
            return Promise.resolve();
        }
        else {
            throw (err);
        }
    });
}
function addStreamsToDb(activityStreams) {
    return ActivityStreams_1.default.create(activityStreams)
        .then((doc) => {
        return Promise.resolve(doc);
    }).catch((err) => {
        if (!lodash_1.isNil(err.code) && err.code === 11000) {
            console.log('addStreamsToDb: duplicate key error');
            return Promise.resolve();
        }
        else {
            throw (err);
        }
    });
}
function getMeanMaximalPowerData(request, response) {
    const activityId = request.params.id;
    return getStreamDataFromDb(Number(activityId))
        .then((streams) => {
        // for now, send the response now
        response.json({ status: 'ok' });
        const watts = streams.watts;
        const maxPowerAtDurations = utilities_1.getMmpData(watts);
        const conditions = { activityId };
        const query = ActivityStreams_1.default.findOneAndUpdate(conditions, { maxPowerAtDurations });
        const promise = query.exec();
        return promise
            .then((retValue) => {
            console.log('mmpPowerData added to db');
            return Promise.resolve();
        });
    });
}
exports.getMeanMaximalPowerData = getMeanMaximalPowerData;
function getAllMaximalPowerData(request, response) {
    console.log('getAllMeanMaximalPowerData');
    const stravatronActivities = [];
    return getActivitiesFromDb()
        .then((dbActivities) => {
        response.json({ status: 'ok' });
        for (const stravatronActivity of dbActivities) {
            if (stravatronActivity.detailsLoaded) {
                stravatronActivities.push(stravatronActivity);
            }
            else {
                const activityName = stravatronActivity.name;
                console.log('Details not loaded for activity: ' + activityName);
            }
        }
        return getMmpDataForAllActivities(stravatronActivities)
            .then((maxPowersAtDurations) => {
            console.log('maxPowersAtDuration length: ' + maxPowersAtDurations.length);
            const mmpDataPath = path.join(__dirname, '../../data/allMmpData.csv');
            const mmpDataStream = fs.createWriteStream(mmpDataPath);
            console.log('begin write');
            maxPowersAtDurations.forEach((maxPowerAtDuration, index) => {
                mmpDataStream.write((index + 5).toString() + ',' + maxPowerAtDuration.toString() + '\n');
            });
            mmpDataStream.end();
            console.log('write complete');
            return Promise.resolve();
        });
    });
}
exports.getAllMaximalPowerData = getAllMaximalPowerData;
// function getAllMmpStreamsForActivities(activities: StravatronActivity[]): Promise<number[][]> {
//   const allMaxPowersAtDurations: number[][] = [];
//   const processNextActivity = (index: number): Promise<number[][]> => {
//     if (index >= activities.length) {
//       return Promise.resolve(allMaxPowersAtDurations);
//     }
//     const activity: StravatronActivity = activities[index];
//     return getStreamDataFromDb(Number(activity.id))
//       .then((streams: StravatronActivityStreams) => {
//         if (!isNil(streams) && !isNil(streams.maxPowerAtDurations) && streams.maxPowerAtDurations.length > 0) {
//           allMaxPowersAtDurations.push(streams.maxPowerAtDurations);
//         }
//         return processNextActivity(index + 1);
//       });
//   };
//   return processNextActivity(0);
// }
function getMmpDataForAllActivities(activities) {
    const maxPowersAtDurations = [];
    const processNextActivity = (index) => {
        console.log('processNextActivity, index: ' + index);
        if (index >= activities.length) {
            console.log(maxPowersAtDurations);
            return Promise.resolve(maxPowersAtDurations);
        }
        const activity = activities[index];
        return getStreamDataFromDb(Number(activity.id))
            .then((streams) => {
            if (!lodash_1.isNil(streams) && !lodash_1.isNil(streams.maxPowerAtDurations) && streams.maxPowerAtDurations.length > 0) {
                reduceMmpData(maxPowersAtDurations, streams.maxPowerAtDurations);
            }
            return processNextActivity(index + 1);
        });
    };
    return processNextActivity(0);
}
function reduceMmpData(currentMaxPowersAtDuration, newMaxPowersAtDuration) {
    let durationIndex = 0;
    while (durationIndex < currentMaxPowersAtDuration.length || durationIndex < newMaxPowersAtDuration.length) {
        if (durationIndex < currentMaxPowersAtDuration.length && durationIndex < newMaxPowersAtDuration.length) {
            if (newMaxPowersAtDuration[durationIndex] > currentMaxPowersAtDuration[durationIndex]) {
                currentMaxPowersAtDuration[durationIndex] = newMaxPowersAtDuration[durationIndex];
            }
        }
        else if (durationIndex >= currentMaxPowersAtDuration.length) {
            currentMaxPowersAtDuration.push(newMaxPowersAtDuration[durationIndex]);
        }
        durationIndex++;
    }
}
//# sourceMappingURL=activity copy.js.map