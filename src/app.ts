import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import morgan from 'morgan';

import { Routes } from './routes/routes';
import activitiesRouter from './routes/activities';
// const mongoDB = 'mongodb://ted:stravaTed-0524@ds063449.mlab.com:63449/stravatron';

class App {

  public app: express.Application;
  public route: Routes = new Routes();

  constructor() {

    // load env variables

    dotenv.config( { path: './src/config/config.env' });
    // dotenv.config( { path: './ts-strava-server/src/config/config.env' });
    // dotenv.config( { path: '/Users/tedshaffer/Documents/Projects/ts-strava/ts-strava-server/src/config/config.env'});
    console.log('port env: ' + process.env.PORT);

    connectDB();

    this.app = express();
    this.config();

    // Body parser
    // this.app.use(express.json());
    this.app.use(express.json({
      limit: '100mb',
    }));

    // this.app.use(logger);
    // Dev logging middleware
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
    
    this.route.routes(this.app);
    this.app.use('/api/v1', activitiesRouter);


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
    // const port = process.env.PORT || 8000;
    // this.app.set('port', port);
    let port: any = process.env.PORT;
    if (port === undefined || port === null || port === '') {
      port = 8000;
    }
    this.app.set('port', port);
  }
}

export default new App().app;
