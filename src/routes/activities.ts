import express from 'express';
const router = express.Router();

import { 
  getActivities,
  getDetailedActivity,
 } from '../controllers';

export class ActivitiesRoutes {

  public routes(app: express.Application): void {
    router.get('/activities', getActivities);
    router.get('/activity/:id', getDetailedActivity);
    app.use('/app/v1', router);
  }
}

