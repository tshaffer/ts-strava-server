import express from 'express';
const activitiesRouter = express.Router();

import { 
  getActivities,
  getDetailedActivity,
  reloadEfforts,
  createActivity,
  createSummaryActivity,
  createSegment,
  createSegmentEffort,
  createStream,
  getStreams,
  getStravaSegmentEffort,
  getStravaSegment,
  insertZwiftSegments,
 } from '../controllers';

activitiesRouter.get('/activities', getActivities);
activitiesRouter.get('/activity/:id', getDetailedActivity);
activitiesRouter.get('/reloadEfforts/:id', reloadEfforts);

// test endpoints
activitiesRouter.post('/summaryActivity', createSummaryActivity);
activitiesRouter.post('/activity', createActivity);
activitiesRouter.post('/segment', createSegment);
activitiesRouter.post('/segmentEffort', createSegmentEffort);
activitiesRouter.post('/stream', createStream);
activitiesRouter.get('/stream/:id', getStreams);
activitiesRouter.get('/segment/:id', getStravaSegment);
activitiesRouter.get('/segmentEffort/:id', getStravaSegmentEffort);

// utility endpoints
activitiesRouter.post('/insertZwiftSegments', insertZwiftSegments);

export default activitiesRouter;
