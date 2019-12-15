import express from 'express';
const activitiesRouter = express.Router();

import { 
  getActivities,
  getDetailedActivity,
  createSummaryActivity,
 } from '../controllers';

activitiesRouter.get('/activities', getActivities);
activitiesRouter.get('/activity/:id', getDetailedActivity);
activitiesRouter.get('/activity/:id', getDetailedActivity);
activitiesRouter.post('/summaryActivity', createSummaryActivity);

export default activitiesRouter;
