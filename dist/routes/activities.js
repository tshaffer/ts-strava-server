"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activitiesRouter = express_1.default.Router();
const controllers_1 = require("../controllers");
activitiesRouter.get('/activities', controllers_1.getActivities);
activitiesRouter.get('/activity/:id', controllers_1.getDetailedActivity);
activitiesRouter.get('/reloadEfforts/:id', controllers_1.reloadEfforts);
activitiesRouter.get('/meanMaximalPowerData/:id', controllers_1.getMeanMaximalPowerData);
activitiesRouter.get('/allMaximalPowerData', controllers_1.getAllMaximalPowerData);
// test endpoints
activitiesRouter.post('/summaryActivity', controllers_1.createSummaryActivity);
activitiesRouter.post('/activity', controllers_1.createActivity);
activitiesRouter.post('/segment', controllers_1.createSegment);
activitiesRouter.post('/segmentEffort', controllers_1.createSegmentEffort);
activitiesRouter.post('/stream', controllers_1.createStream);
activitiesRouter.post('/deleteActivity', controllers_1.deleteActivity);
activitiesRouter.post('/deleteActivities', controllers_1.deleteActivities);
activitiesRouter.get('/stream/:id', controllers_1.getStreams);
activitiesRouter.get('/segment/:id', controllers_1.getStravaSegment);
activitiesRouter.get('/segmentEffort/:id', controllers_1.getStravaSegmentEffort);
// utility endpoints
activitiesRouter.post('/insertZwiftSegments', controllers_1.insertZwiftSegments);
exports.default = activitiesRouter;
//# sourceMappingURL=activities.js.map