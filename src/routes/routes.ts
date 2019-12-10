import express from 'express';
import { 
  getIndex,
  getCSS,
  getBundle,
  getAthletes,
  getActivities,
  getDetailedActivity,
 } from '../controllers';

export class Routes {

  public routes(app: express.Application): void {
    this.createRoutes(app);
  }

  createRoutes(app: express.Application) {
    app.get('/', getIndex);
    app.get('/index.html', getIndex);
    app.get('/css/app.css', getCSS);
    app.get('/build/bundle.js', getBundle);
    app.get('/app/v1/activities', getActivities);
    app.get('/app/v1/activity/:id', getDetailedActivity);
    app.get('/app/v1/athletes', getAthletes);
  }
}
