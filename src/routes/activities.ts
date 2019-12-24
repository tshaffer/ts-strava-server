import express from 'express';
const activitiesRouter = express.Router();

import { 
  getSummaryActivities,
  getDetailedActivity,
  createActivity,
  createSummaryActivity,
  createSegment,
  createSegmentEffort,
  createStream,
  getStreams,
  getStravaSegmentEffort,
  getStravaSegment,
 } from '../controllers';

activitiesRouter.get('/activities', getSummaryActivities);
activitiesRouter.get('/activity/:id', getDetailedActivity);

// test endpoints
activitiesRouter.post('/summaryActivity', createSummaryActivity);
activitiesRouter.post('/activity', createActivity);
activitiesRouter.post('/segment', createSegment);
activitiesRouter.post('/segmentEffort', createSegmentEffort);
activitiesRouter.post('/stream', createStream);
activitiesRouter.get('/stream/:id', getStreams);
activitiesRouter.get('/segment/:id', getStravaSegment);
activitiesRouter.get('/segmentEffort/:id', getStravaSegmentEffort);

export default activitiesRouter;
