import express from 'express';
const activitiesRouter = express.Router();

import { 
  getActivities,
  getDetailedActivity,
  createActivity,
  createSummaryActivity,
  createSegment,
  createSegmentEffort,
  createStream,
 } from '../controllers';

activitiesRouter.get('/activities', getActivities);
activitiesRouter.get('/activity/:id', getDetailedActivity);

// test endpoints
activitiesRouter.post('/summaryActivity', createSummaryActivity);
activitiesRouter.post('/activity', createActivity);
activitiesRouter.post('/segment', createSegment);
activitiesRouter.post('/segmentEffort', createSegmentEffort);
activitiesRouter.post('/stream', createStream);

export default activitiesRouter;
