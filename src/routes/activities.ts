import express from 'express';
const activitiesRouter = express.Router();

import { 
  getActivities,
  getDetailedActivity,
 } from '../controllers';

activitiesRouter.get('/activities', getActivities);
activitiesRouter.get('/activity/:id', getDetailedActivity);

export default activitiesRouter;