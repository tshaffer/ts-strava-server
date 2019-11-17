import https from 'https';
import axios from 'axios';
import { isNil } from 'lodash';

import { StravaNativeActivity, Activity } from '../type';

export function retrieveAccessToken() {

  const serverUrl = 'https://www.strava.com/';
  const apiPrefix = 'api/v3/';
  const endPoint = 'oauth/token';
  const path = serverUrl + apiPrefix + endPoint;

  // -d "client_id=2055" -d "client_secret=85f821429c9da1ef02b627058119a4253eafd16d" -d "grant_type=refresh_token" -d "refresh_token=ca65f7aff433b44f351ff04ce0b33085bb0a0ed6" 

  console.log('axios post');
  console.log('path: ', path);

  return axios.post(path,
    {
      client_id: 2055,
      client_secret: '85f821429c9da1ef02b627058119a4253eafd16d',
      grant_type: 'refresh_token',
      refresh_token: 'ca65f7aff433b44f351ff04ce0b33085bb0a0ed6',
    })
    .then((response: any) => {
      console.log('response to axios post: ');
      console.log(response);
      return Promise.resolve(response.data.access_token);
    }).catch((err: Error) => {
      console.log('response to axios post: ');
      console.log('err: ', err);
      return Promise.reject(err);
    });
}

function fetchStravaData(endPoint: string, accessToken: string) {

  return new Promise((resolve, reject) => {
    const options: any = {
      host: 'www.strava.com',
      path: '/api/v3/' + endPoint,
      port: 443,
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    };

    let str = '';

    https.get(options, (res) => {
      res.on('data', (d) => {
        str += d;
      });
      res.on('end', () => {
        const data = JSON.parse(str);
        resolve(data);
      });

    }).on('error', (err) => {
      console.log('Caught exception: ' + err);
      reject(err);
    });
  });
}

function parseStravaSummaryActivities(stravaSummaryActivities: StravaNativeActivity[]) {

  const activities: Activity[] = [];

  if (!(stravaSummaryActivities instanceof Array)) {
    console.log('stravaSummaryActivities not array');
    // reject("error");
    return;
  }

  stravaSummaryActivities.forEach( (stravaNativeActivity: StravaNativeActivity) => {

    console.log(stravaNativeActivity);

    const activity: Activity = {
      id: stravaNativeActivity.id,
      athlete: stravaNativeActivity.athlete,
      averageSpeed: stravaNativeActivity.average_speed,
      description: stravaNativeActivity.description,
      distance: stravaNativeActivity.distance,
      elapsedTime: stravaNativeActivity.elapsed_time,
      kilojoules: stravaNativeActivity.kilojoules,
      city: stravaNativeActivity.city,
      maxSpeed: stravaNativeActivity.max_speed,
      movingTime: stravaNativeActivity.moving_time,
      name: stravaNativeActivity.name,
      startDateLocal: stravaNativeActivity.start_date_local,
      totalElevationGain: stravaNativeActivity.total_elevation_gain,
    };

    if (!isNil(stravaNativeActivity.map) && !isNil(stravaNativeActivity.map.summary_polyline)) {
      activity.mapSummaryPolyline = stravaNativeActivity.map.summary_polyline;
    }

    if (isNil(stravaNativeActivity.description)) {
      activity.description = '';
    }
    if (isNil(stravaNativeActivity.kilojoules)) {
      activity.kilojoules = 0;
    }
    if (isNil(stravaNativeActivity.city)) {
      activity.city = '';
    }
    activities.push(activity);
  });

  return activities;
}

export function fetchSummaryActivities(accessToken: string, secondsSinceEpochOfLastActivity: number): Promise<any> {

  return new Promise((resolve) => {

    const path = 'athlete/activities?after=' + secondsSinceEpochOfLastActivity.toString();

    fetchStravaData(path, accessToken)
      .then( (stravaSummaryActivities: any[]) => {
        const activities = parseStravaSummaryActivities(stravaSummaryActivities);
        resolve(activities);
    });
  });
}

