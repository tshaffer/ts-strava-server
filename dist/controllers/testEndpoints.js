"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Activity_1 = __importDefault(require("../models/Activity"));
const Segment_1 = __importDefault(require("../models/Segment"));
const SegmentEffort_1 = __importDefault(require("../models/SegmentEffort"));
const ActivityStreams_1 = __importDefault(require("../models/ActivityStreams"));
const strava_1 = require("./strava");
const activity_1 = require("./activity");
function deleteActivity(request, response, next) {
    console.log('deleteActivity');
    console.log(request.body);
    const activityId = Number(request.body.activityId);
    strava_1.retrieveAccessToken()
        .then((accessToken) => {
        const promise = Activity_1.default.deleteOne({ id: { $eq: activityId } });
        promise.then(() => {
            console.log('Activity document deleted');
            const promise2 = ActivityStreams_1.default.deleteMany({ activityId: { $eq: activityId } });
            promise2.then(() => {
                console.log('ActivityStream document(s) deleted');
                const promise3 = SegmentEffort_1.default.deleteMany({ activityId: { $eq: activityId } });
                promise3.then(() => {
                    console.log('SegmentEffort document(s) deleted');
                    response.status(200).json({
                        success: true,
                    });
                });
            });
        });
    });
}
exports.deleteActivity = deleteActivity;
function deleteActivities(request, response, next) {
    console.log('deleteActivities');
    console.log(request.body);
    const activityDeletePromises = [];
    for (const activityId of request.body.activityIds) {
        const promise = Activity_1.default.deleteOne({ id: { $eq: activityId } });
        activityDeletePromises.push(promise);
    }
    Promise.all(activityDeletePromises).then(() => {
        const activityStreamDeletePromises = [];
        for (const activityId of request.body.activityIds) {
            const promise = ActivityStreams_1.default.deleteMany({ activityId: { $eq: activityId } });
            activityStreamDeletePromises.push(promise);
        }
        Promise.all(activityStreamDeletePromises).then(() => {
            const segmentEffortDeletePromises = [];
            for (const activityId of request.body.activityIds) {
                const promise = SegmentEffort_1.default.deleteMany({ activityId: { $eq: activityId } });
                segmentEffortDeletePromises.push(promise);
            }
            Promise.all(segmentEffortDeletePromises).then(() => {
                console.log('All document(s) deleted');
                response.status(200).json({
                    success: true,
                });
            });
        });
    });
}
exports.deleteActivities = deleteActivities;
function getStravaSegment(request, response, next) {
    const segmentId = Number(request.params.id);
    strava_1.retrieveAccessToken()
        .then((accessToken) => {
        return strava_1.fetchSegment(accessToken, segmentId)
            .then((segment) => {
            response.status(200).json({
                success: true,
                data: segment,
            });
        });
    });
}
exports.getStravaSegment = getStravaSegment;
function getStravaSegmentEffort(request, response, next) {
    const segmentEffortId = Number(request.params.id);
    strava_1.retrieveAccessToken()
        .then((accessToken) => {
        return strava_1.fetchSegmentEffort(accessToken, segmentEffortId)
            .then((segmentEffort) => {
            response.status(200).json({
                success: true,
                data: segmentEffort,
            });
        });
    });
}
exports.getStravaSegmentEffort = getStravaSegmentEffort;
function createActivity(request, response, next) {
    console.log('createActivity');
    console.log(request.body);
    Activity_1.default.create(request.body).then((activity) => {
        response.status(201).json({
            success: true,
            data: activity,
        });
    });
}
exports.createActivity = createActivity;
function createSegment(request, response, next) {
    console.log('createSegment');
    console.log(request.body);
    Segment_1.default.create(request.body).then((segment) => {
        response.status(201).json({
            success: true,
            data: segment,
        });
    });
}
exports.createSegment = createSegment;
function createSegmentEffort(request, response, next) {
    console.log('createSegmentEffort');
    console.log(request.body);
    SegmentEffort_1.default.create(request.body).then((segmentEffort) => {
        response.status(201).json({
            success: true,
            data: segmentEffort,
        });
    });
}
exports.createSegmentEffort = createSegmentEffort;
function createStream(request, response, next) {
    console.log('createStream');
    // console.log(request.body);
    const bodySize = roughSizeOfObject(request.body);
    console.log('bodySize: ' + bodySize);
    ActivityStreams_1.default.create(request.body).then((activityStreams) => {
        response.status(201).json({
            success: true,
            data: activityStreams,
        });
    });
}
exports.createStream = createStream;
function getStreams(request, response) {
    const activityId = request.params.id;
    let accessToken;
    return strava_1.retrieveAccessToken()
        .then((accessTokenRet) => {
        accessToken = accessTokenRet;
        return strava_1.fetchStreams(accessToken, activityId);
    }).then((streams) => {
        const stravatronStreamData = activity_1.getStreamData(Number(activityId), streams);
        console.log(stravatronStreamData);
        return response.status(201).json({
            success: true,
            data: stravatronStreamData,
        });
    });
}
exports.getStreams = getStreams;
function roughSizeOfObject(object) {
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
        else if (typeof value === 'object'
            && objectList.indexOf(value) === -1) {
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
//# sourceMappingURL=testEndpoints.js.map