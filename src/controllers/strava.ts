import https from 'https';
import axios from 'axios';
import { isNil } from 'lodash';

import { StravaNativeActivity, Activity, StravaNativeDetailedActivity, DetailedActivity, StravaNativeSegmentEffort, SegmentEffort, Segment, StravaNativeAchievement, Achievement } from '../type';

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

function parseStravaSummaryActivities(stravaSummaryActivities: StravaNativeActivity[]): Activity[] {

  const activities: Activity[] = [];

  if (!(stravaSummaryActivities instanceof Array)) {
    console.log('stravaSummaryActivities not array');
    // reject("error");
    return;
  }

  stravaSummaryActivities.forEach((stravaNativeActivity: StravaNativeActivity) => {

    console.log(stravaNativeActivity);

    const activity: Activity = {
      id: stravaNativeActivity.id,
      athleteId: stravaNativeActivity.athlete.id,
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
      .then((stravaSummaryActivities: any[]) => {
        const activities = parseStravaSummaryActivities(stravaSummaryActivities);
        resolve(activities);
      });
  });
}

function parseStravaDetailedActivity(stravaDetailedActivity: StravaNativeDetailedActivity): DetailedActivity {

  // console.log(stravaDetailedActivity);

  const segmentEfforts: SegmentEffort[] = [];

  for (const stravaNativeSegmentEffort of stravaDetailedActivity.segment_efforts) {

    const achievements: Achievement[] = [];
    for (const stravaAchievement of stravaNativeSegmentEffort.achievements) {
      const achievement: Achievement = {
        type: stravaAchievement.type,
        rank: stravaAchievement.rank,
      };
      achievements.push(achievement);
    }

    const segment: Segment = {
      id: stravaNativeSegmentEffort.segment.id,
      name: stravaNativeSegmentEffort.segment.name,
      distance: stravaNativeSegmentEffort.segment.distance,
      averageGrade: stravaNativeSegmentEffort.segment.average_grade,
      maximumGrade: stravaNativeSegmentEffort.segment.maximum_grade,
      elevationHigh: stravaNativeSegmentEffort.segment.elevation_high,
      elevationLow: stravaNativeSegmentEffort.segment.elevation_low,
    };

    const segmentEffort: SegmentEffort = {
      id: stravaNativeSegmentEffort.id,
      name: stravaNativeSegmentEffort.name,
      activityId: stravaNativeSegmentEffort.activity.id,
      elapsedTime: stravaNativeSegmentEffort.elapsed_time,
      movingTime: stravaNativeSegmentEffort.moving_time,
      startDateLocal: stravaNativeSegmentEffort.start_date_local,
      distance: stravaNativeSegmentEffort.distance,
      averageWatts: stravaNativeSegmentEffort.average_watts,
      segment,
      prRank: stravaNativeSegmentEffort.pr_rank,
      achievements,
    };

    segmentEfforts.push(segmentEffort);
  }

  // TEDTODO - create method for assigning based activity members and use that here and for
  // summary activities
  const detailedActivity: DetailedActivity = {
    id: stravaDetailedActivity.id,
    athleteId: stravaDetailedActivity.athlete.id,
    averageSpeed: stravaDetailedActivity.average_speed,
    description: stravaDetailedActivity.description,
    distance: stravaDetailedActivity.distance,
    elapsedTime: stravaDetailedActivity.elapsed_time,
    kilojoules: stravaDetailedActivity.kilojoules,
    city: stravaDetailedActivity.city,
    maxSpeed: stravaDetailedActivity.max_speed,
    movingTime: stravaDetailedActivity.moving_time,
    name: stravaDetailedActivity.name,
    startDateLocal: stravaDetailedActivity.start_date_local,
    totalElevationGain: stravaDetailedActivity.total_elevation_gain,
    mapPolyline: stravaDetailedActivity.map.polyline,
    averageTemp: stravaDetailedActivity.average_temp,
    averageWatts: stravaDetailedActivity.average_watts,
    segmentEfforts,
  };

  if (!isNil(stravaDetailedActivity.map) && !isNil(stravaDetailedActivity.map.summary_polyline)) {
    detailedActivity.mapSummaryPolyline = stravaDetailedActivity.map.summary_polyline;
  }

  if (isNil(stravaDetailedActivity.description)) {
    detailedActivity.description = '';
  }
  if (isNil(stravaDetailedActivity.kilojoules)) {
    detailedActivity.kilojoules = 0;
  }
  if (isNil(stravaDetailedActivity.city)) {
    detailedActivity.city = '';
  }

  return detailedActivity;
}

export function fetchDetailedActivity(accessToken: string, activityId: string): Promise<any> {

  return new Promise((resolve) => {

    const path = 'activities/' + activityId;

    fetchStravaData(path, accessToken)
      .then((stravaDetailedActivity: any) => {
        const detailedActivity: DetailedActivity = parseStravaDetailedActivity(stravaDetailedActivity);
        console.log(detailedActivity);
        resolve(detailedActivity);
      });
  });
}

export function fetchStream(accessToken: string, activityId: string): Promise<any> {

  return new Promise((resolve) => {

    const path = 'activities/' + activityId + '/streams/time,latlng,distance,altitude,grade_smooth';

    fetchStravaData(path, accessToken)
      .then((stravaStreams) => {
        resolve(stravaStreams);
      });
  });
}

export function fetchAllEfforts(accessToken: string, athleteId: string, segmentId: string): Promise<any> {

  return new Promise((resolve) => {

    const path = 'segments/' + segmentId.toString() + '/all_efforts?athlete_id=' + athleteId.toString();

    fetchStravaData(path, accessToken)
      .then( (stravaAllEfforts) => {
        resolve(stravaAllEfforts);
      });
  });
}

// retrieveBaseMapSegments
