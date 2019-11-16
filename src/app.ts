import * as bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import * as path from 'path';


import { Routes } from './routes/routes';

const mongoDB = 'mongodb://ted: stravaTed-0524@ds063449.mlab.com:63449/stravatron';
// const mongoDB = process.env.MONGOLAB_URI; 

class App {

  public app: express.Application;
  public route: Routes = new Routes();

  constructor() {

    this.app = express();
    this.config();
    this.route.routes(this.app);

    // Workaround to allow empty strings
    // https://github.com/Automattic/mongoose/issues/7150
    const Str = mongoose.Schema.Types.String as any;
    Str.checkRequired((v: any) => v != null);

    mongoose.connect(mongoDB);
    mongoose.Promise = global.Promise;
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', function callback() {
      console.log('stravatron db open successful');
    });

    console.log('end of constructor');
  }

  private config(): void {

    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));

    this.app.use(bodyParser.json());

    let port: any = process.env.PORT;
    if (port === undefined || port === null || port === '') {
      port = 8000;
    }
    this.app.set('port', port);
  }
}

export default new App().app;
