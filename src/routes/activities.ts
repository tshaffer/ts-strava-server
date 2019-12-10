import express from 'express';
const router = express.Router();

import { 
  getActivities,
  getDetailedActivity,
 } from '../controllers';

export class ActivitiesRoutes {

  public routes(app: express.Application): void {
    router.get('/app/v1/activities', getActivities);
    router.get('/app/v1/activity/:id', getDetailedActivity);
    app.use('/', router);
  }
}

