import express from 'express';
const activitiesRouter = express.Router();

import { 
  getActivities,
  getDetailedActivity,
  createActivity,
  createSummaryActivity,
 } from '../controllers';

activitiesRouter.get('/activities', getActivities);
activitiesRouter.get('/activity/:id', getDetailedActivity);
activitiesRouter.post('/summaryActivity', createSummaryActivity);
activitiesRouter.post('/activity', createActivity);

export default activitiesRouter;
