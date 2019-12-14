import * as bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
// import mongoose from 'mongoose';
import * as path from 'path';
// const connectDB = require('../config/db');
import connectDB from './config/db';

import { Routes } from './routes/routes';
import activitiesRouter from './routes/activities';
// const mongoDB = 'mongodb://ted:stravaTed-0524@ds063449.mlab.com:63449/stravatron';
// const mongoDB = process.env.MONGOLAB_URI; 

class App {

  public app: express.Application;
  public route: Routes = new Routes();

  constructor() {

    // load env variables

    dotenv.config( { path: './ts-strava-server/src/config/config.env' });
    // dotenv.config( { path: '/Users/tedshaffer/Documents/Projects/ts-strava/ts-strava-server/src/config/config.env'});
    console.log('port env: ' + process.env.PORT);

    connectDB();

    this.app = express();

    const logger = (request: Request, response: Response, next: any) => {
      (request as any).hello = 'hello world';
      console.log('middleware ran');
      next();
    };

    this.app.use(logger as any);

    this.config();
    
    this.route.routes(this.app);
    this.app.use('/app/v1', activitiesRouter);


    // Workaround to allow empty strings
    // https://github.com/Automattic/mongoose/issues/7150
    // const Str = mongoose.Schema.Types.String as any;
    // Str.checkRequired((v: any) => v != null);

    // mongoose.connect(mongoDB);
    // mongoose.Promise = global.Promise;
    // const db = mongoose.connection;
    // db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    // db.once('open', function callback() {
    //   console.log('stravatron db open successful');
    // });

    console.log('end of constructor');
  }

  private config(): void {

    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));

    this.app.use(bodyParser.json());

    const port = process.env.PORT || 8000;
    this.app.set('port', port);
  }
}

export default new App().app;
