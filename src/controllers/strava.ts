import https from 'https';
import axios from 'axios';
import { isNil } from 'lodash';

import { StravatronSummaryActivity, StravaNativeSummaryActivity, StravatronDetailedActivity, StravaNativeDetailedActivity } from '../type/activity';
import { StravatronSegmentEffort, StravatronSummarySegment, StravatronAchievement, StravaNativeDetailedSegment, StravaNativeSummarySegment, StravatronDetailedSegment } from '../type';

export function retrieveAccessToken() {

  const serverUrl = 'https://www.strava.com/';
  const apiPrefix = 'api/v3/';
  const endPoint = 'oauth/token';
  const path = serverUrl + apiPrefix + endPoint;

  // -d 'client_id=2055' -d 'client_secret=85f821429c9da1ef02b627058119a4253eafd16d' -d 'grant_type=refresh_token' -d 'refresh_token=ca65f7aff433b44f351ff04ce0b33085bb0a0ed6' 

  return axios.post(path,
    {
      client_id: 2055,
      client_secret: '85f821429c9da1ef02b627058119a4253eafd16d',
      grant_type: 'refresh_token',
      refresh_token: 'ca65f7aff433b44f351ff04ce0b33085bb0a0ed6',
    })
    .then((response: any) => {
      return Promise.resolve(response.data.access_token);
    }).catch((err: Error) => {
      console.log('response to axios post: ');
      console.log('err: ', err);
      return Promise.reject(err);
    });
}

function fetchStravaData(endPoint: string, accessToken: string): Promise<any> {

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

export function fetchSummaryActivities(accessToken: string, secondsSinceEpochOfLastActivity: number): Promise<StravatronSummaryActivity[]> {

  return new Promise((resolve) => {

    const path = 'athlete/activities?after=' + secondsSinceEpochOfLastActivity.toString();

    fetchStravaData(path, accessToken)
      .then((stravaSummaryActivities: any[]) => {
        const activities = transformStravaSummaryActivities(stravaSummaryActivities);
        resolve(activities);
      });
  });
}

function transformStravaSummaryActivities(stravaSummaryActivities: StravaNativeSummaryActivity[]): StravatronSummaryActivity[] {

  const activities: StravatronSummaryActivity[] = [];

  if (!(stravaSummaryActivities instanceof Array)) {
    console.log('stravaSummaryActivities not array');
    // reject('error');
    return;
  }

  stravaSummaryActivities.forEach((stravaNativeActivity: StravaNativeSummaryActivity) => {

    console.log(stravaNativeActivity);

    const activity: StravatronSummaryActivity = {
      achievementCount: stravaNativeActivity.achievement_count,
      athleteId: stravaNativeActivity.athlete.id,
      averageSpeed: stravaNativeActivity.average_speed,
      // averageTemp: stravaNativeActivity.average_temp,
      averageWatts: stravaNativeActivity.average_watts,
      deviceWatts: null,
      distance: stravaNativeActivity.distance,
      elapsedTime: stravaNativeActivity.elapsed_time,
      elevHigh: stravaNativeActivity.elev_high,
      elevLow: stravaNativeActivity.elev_low,
      endLatlng: stravaNativeActivity.end_latlng,
      id: stravaNativeActivity.id,
      kilojoules: stravaNativeActivity.kilojoules,
      city: stravaNativeActivity.location_city,
      country: stravaNativeActivity.location_country,
      state: stravaNativeActivity.location_state,
      map: stravaNativeActivity.map,
      maxSpeed: stravaNativeActivity.max_speed,
      movingTime: stravaNativeActivity.moving_time,
      name: stravaNativeActivity.name,
      prCount: stravaNativeActivity.pr_count,
      resourceState: stravaNativeActivity.resource_state,
      startDate: stravaNativeActivity.start_date,
      startDateLocal: stravaNativeActivity.start_date_local,
      startLatitude: stravaNativeActivity.start_latitude,
      startLatlng: stravaNativeActivity.start_latlng,
      startLongitude: stravaNativeActivity.start_longitude,
      timezone: stravaNativeActivity.timezone,
      totalElevationGain: stravaNativeActivity.total_elevation_gain,
      // weightedAverageWatts: stravaNativeActivity.weighted_average_watts,
    };

    activities.push(activity);
  });

  return activities;
}

export function fetchDetailedActivity(accessToken: string, activityId: string): Promise<StravatronDetailedActivity> {

  return new Promise((resolve) => {

    const path = 'activities/' + activityId;

    fetchStravaData(path, accessToken)
      .then((stravaDetailedActivity: any) => {
        const detailedActivity: StravatronDetailedActivity = transformStravaDetailedActivity(stravaDetailedActivity);
        resolve(detailedActivity);
      });
  });
}

function transformStravaDetailedActivity(stravaDetailedActivity: StravaNativeDetailedActivity): StravatronDetailedActivity {

  const segmentEfforts: StravatronSegmentEffort[] = [];

  for (const stravaNativeSegmentEffort of stravaDetailedActivity.segment_efforts) {

    const achievements: StravatronAchievement[] = [];
    for (const stravaAchievement of stravaNativeSegmentEffort.achievements) {
      const achievement: StravatronAchievement = {
        type: stravaAchievement.type,
        rank: stravaAchievement.rank,
        typeId: stravaAchievement.type_id,
      };
      achievements.push(achievement);
    }

    const segment: StravatronSummarySegment = {
      id: stravaNativeSegmentEffort.segment.id,
      name: stravaNativeSegmentEffort.segment.name,
      distance: stravaNativeSegmentEffort.segment.distance,
      averageGrade: stravaNativeSegmentEffort.segment.average_grade,
      maximumGrade: stravaNativeSegmentEffort.segment.maximum_grade,
      elevationHigh: stravaNativeSegmentEffort.segment.elevation_high,
      elevationLow: stravaNativeSegmentEffort.segment.elevation_low,
      activityType: stravaNativeSegmentEffort.segment.activity_type,
      climbCategory: stravaNativeSegmentEffort.segment.climb_category,
      startLatlng: stravaNativeSegmentEffort.segment.start_latlng,
      endLatlng: stravaNativeSegmentEffort.segment.end_latlng,
    };

    const segmentEffort: StravatronSegmentEffort = {
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
      averageCadence: stravaNativeSegmentEffort.average_cadence,
      averageHeartrate: stravaNativeSegmentEffort.average_heartrate,
      deviceWatts: stravaNativeSegmentEffort.device_watts,
      maxHeartrate: stravaNativeSegmentEffort.max_heartrate,
      startDate: stravaNativeSegmentEffort.start_date,
    };

    segmentEfforts.push(segmentEffort);
  }

  console.log('poo');

  // // TEDTODO - create method for assigning based activity members and use that here and for
  // // summary activities
  const detailedActivity: StravatronDetailedActivity = {
    id: stravaDetailedActivity.id,
    athleteId: stravaDetailedActivity.athlete.id,
    averageSpeed: stravaDetailedActivity.average_speed,
    description: stravaDetailedActivity.description,
    distance: stravaDetailedActivity.distance,
    elapsedTime: stravaDetailedActivity.elapsed_time,
    kilojoules: stravaDetailedActivity.kilojoules,
    city: stravaDetailedActivity.location_city,
    maxSpeed: stravaDetailedActivity.max_speed,
    movingTime: stravaDetailedActivity.moving_time,
    name: stravaDetailedActivity.name,
    startDateLocal: stravaDetailedActivity.start_date_local,
    totalElevationGain: stravaDetailedActivity.total_elevation_gain,
    map: stravaDetailedActivity.map,
    averageWatts: stravaDetailedActivity.average_watts,
    segmentEfforts,
    calories: stravaDetailedActivity.calories,
    weightedAverageWatts: stravaDetailedActivity.weighted_average_watts,
    achievementCount: stravaDetailedActivity.achievement_count,
    deviceWatts: stravaDetailedActivity.device_watts,
    elevHigh: stravaDetailedActivity.elev_high,
    elevLow: stravaDetailedActivity.elev_low,
    endLatlng: stravaDetailedActivity.end_latlng,
    country: stravaDetailedActivity.location_country,
    state: stravaDetailedActivity.location_state,
    prCount: stravaDetailedActivity.pr_count,
    resourceState: stravaDetailedActivity.resource_state,
    startDate: stravaDetailedActivity.start_date,
    startLatitude: stravaDetailedActivity.start_latitude,
    startLatlng: stravaDetailedActivity.start_latlng,
    startLongitude: stravaDetailedActivity.start_longitude,
    timezone: stravaDetailedActivity.timezone,
    averageCadence: stravaDetailedActivity.average_cadence,
    averageHeartrate: stravaDetailedActivity.average_heartrate,
    deviceName: stravaDetailedActivity.device_name,
    hasHeartrate: stravaDetailedActivity.has_heartrate,
    maxHeartrate: stravaDetailedActivity.max_heartrate,
    maxWatts: stravaDetailedActivity.max_watts,
    type: stravaDetailedActivity.type,
    utcOffset: stravaDetailedActivity.utc_offset,
  };

  // if (!isNil(stravaDetailedActivity.map) && !isNil(stravaDetailedActivity.map.summary_polyline)) {
  //   detailedActivity.mapSummaryPolyline = stravaDetailedActivity.map.summary_polyline;
  // }

  // if (isNil(stravaDetailedActivity.description)) {
  //   detailedActivity.description = '';
  // }
  // if (isNil(stravaDetailedActivity.kilojoules)) {
  //   detailedActivity.kilojoules = 0;
  // }
  // if (isNil(stravaDetailedActivity.city)) {
  //   detailedActivity.city = '';
  // }

  // return detailedActivity;
  return detailedActivity;
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

export function fetchAllEfforts(accessToken: string, athleteId: string, segmentId: number): Promise<StravatronDetailedSegment[]> {

  return new Promise((resolve) => {

    const path = 'segments/' + segmentId.toString() + '/all_efforts?athlete_id=' + athleteId.toString();

    fetchStravaData(path, accessToken)
      .then((stravaAllEfforts) => {
        resolve(stravaAllEfforts);
      });
  });
}

export function fetchSegment(accessToken: string, segmentId: number): Promise<StravatronDetailedSegment> {

  return new Promise((resolve) => {

    const path = 'segments/' + segmentId.toString();

    fetchStravaData(path, accessToken)
      .then((stravaDetailedSegment: StravaNativeDetailedSegment) => {
        const stravatronDetailedSegment: StravatronDetailedSegment = transformStravaSegment(stravaDetailedSegment);
        resolve(stravatronDetailedSegment);
      });
  });
}

function transformStravaSegment(stravaSegment: StravaNativeDetailedSegment): StravatronDetailedSegment {
  const stravatronDetailedSegment: StravatronDetailedSegment = {
    id: stravaSegment.id,
    name: stravaSegment.name,
    distance: stravaSegment.distance,
    averageGrade: stravaSegment.average_grade,
    maximumGrade: stravaSegment.maximum_grade,
    elevationHigh: stravaSegment.elevation_high,
    elevationLow: stravaSegment.elevation_low,
    activityType: stravaSegment.activity_type,
    climbCategory: stravaSegment.climb_category,
    startLatlng: stravaSegment.start_latlng,
    endLatlng: stravaSegment.end_latlng,
    totalElevationGain: stravaSegment.total_elevation_gain,
    map: stravaSegment.map,
    effortCount: stravaSegment.effort_count,
  };
  return stravatronDetailedSegment;
}

// retrieveBaseMapSegments
