import express from 'express';
import { 
  getIndex,
  getCSS,
  getBundle,
 } from '../controllers/mainController';
// import {
//   setRestaurant,
//   getAllRestaurants,
// } from '../controllers/restaurant';
// import { setRestaurantVisit, getAllRestaurantVisits } from '../controllers/restaurantVisit';

export class Routes {

  public routes(app: express.Application): void {
    this.createRoutes(app);
  }

  createRoutes(app: express.Application) {
    app.get('/', getIndex);
    app.get('/index.html', getIndex);
    app.get('/css/app.css', getCSS);
    app.get('/build/bundle.js', getBundle);
  }
}
