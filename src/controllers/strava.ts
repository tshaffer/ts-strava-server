import https from 'https';
import axios from 'axios';

import {
  StravatronSummaryActivity,
  StravaNativeSummaryActivity,
  StravaNativeDetailedActivity,
  StravatronSegmentEffort,
  StravatronAchievement,
  StravaNativeDetailedSegment,
  StravaNativeSummarySegment,
  StravatronDetailedSegment,
  StravaNativeStream,
  StravatronStream,
  StravaNativeDetailedSegmentEffort,
  StravatronActivity,
} from '../type';

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
      // return Promise.resolve('d1ffbed373d24635a608e7601e82e317383bfd40');
    }).catch((err: Error) => {
      console.log('response to axios post: ');
      console.log('err: ', err);
      return Promise.reject(err);
    });
}

function fetchStravaData(endPoint: string, accessToken: string): Promise<any> {

  // accessToken = 'af14818508e2cc9865f2d61c123c5ac6c93e5db9';

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
      .then((stravaSummaryActivities: StravaNativeSummaryActivity[]) => {
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

    const activity: StravatronSummaryActivity = {
      achievementCount: stravaNativeActivity.achievement_count,
      athleteId: stravaNativeActivity.athlete.id,
      averageCadence: stravaNativeActivity.average_cadence,
      averageHeartrate: stravaNativeActivity.average_heartrate,
      averageSpeed: stravaNativeActivity.average_speed,
      averageWatts: stravaNativeActivity.average_watts,
      detailsLoaded: false,
      distance: stravaNativeActivity.distance,
      elapsedTime: stravaNativeActivity.elapsed_time,
      elevHigh: stravaNativeActivity.elev_high,
      elevLow: stravaNativeActivity.elev_low,
      endLatlng: stravaNativeActivity.end_latlng,
      hasHeartrate: stravaNativeActivity.has_heartrate,
      id: stravaNativeActivity.id,
      kilojoules: stravaNativeActivity.kilojoules,
      city: stravaNativeActivity.location_city,
      country: stravaNativeActivity.location_country,
      map: stravaNativeActivity.map,
      maxHeartrate: stravaNativeActivity.max_heartrate,
      maxSpeed: stravaNativeActivity.max_speed,
      maxWatts: stravaNativeActivity.max_watts,
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
      type: stravaNativeActivity.type,
      utcOffset: stravaNativeActivity.utc_offset,
      deviceWatts: stravaNativeActivity.device_watts,
      weightedAverageWatts: stravaNativeActivity.weighted_average_watts,
      averageTemp: stravaNativeActivity.average_temp,
    };
    activities.push(activity);
  });

  return activities;
}

export function fetchDetailedActivity(accessToken: string, activityId: string): Promise<StravaNativeDetailedActivity> {

  return new Promise((resolve) => {

    const path = 'activities/' + activityId + '?include_all_efforts=true';

    fetchStravaData(path, accessToken)
      .then((stravaDetailedActivity: StravaNativeDetailedActivity) => {
        resolve(stravaDetailedActivity);
      });
  });
}

export function transformStravaDetailedActivity(stravaDetailedActivity: StravaNativeDetailedActivity): StravatronActivity {

  const segmentEfforts: StravatronSegmentEffort[] = [];

  for (const stravaNativeSegmentEffort of stravaDetailedActivity.segment_efforts) {

    const achievements: StravatronAchievement[] = [];
    for (const stravaAchievement of stravaNativeSegmentEffort.achievements) {
      const achievement: StravatronAchievement = {
        achievementType: stravaAchievement.type,
        rank: stravaAchievement.rank,
        typeId: stravaAchievement.type_id,
      };
      achievements.push(achievement);
    }

    const segmentEffort: StravatronSegmentEffort = {
      id: stravaNativeSegmentEffort.id,
      segmentId: stravaNativeSegmentEffort.segment.id,
      name: stravaNativeSegmentEffort.name,
      activityId: stravaNativeSegmentEffort.activity.id,
      elapsedTime: stravaNativeSegmentEffort.elapsed_time,
      movingTime: stravaNativeSegmentEffort.moving_time,
      startDateLocal: stravaNativeSegmentEffort.start_date_local,
      distance: stravaNativeSegmentEffort.distance,
      averageWatts: stravaNativeSegmentEffort.average_watts,
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


  // // TEDTODO - create method for assigning based activity members and use that here and for
  // // summary activities
  const detailedActivity: StravatronActivity = {
    id: stravaDetailedActivity.id,
    athleteId: stravaDetailedActivity.athlete.id,
    averageSpeed: stravaDetailedActivity.average_speed,
    description: stravaDetailedActivity.description,
    detailsLoaded: false,
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
    // segmentEfforts,
    calories: stravaDetailedActivity.calories,
    weightedAverageWatts: stravaDetailedActivity.weighted_average_watts,
    achievementCount: stravaDetailedActivity.achievement_count,
    deviceWatts: stravaDetailedActivity.device_watts,
    elevHigh: stravaDetailedActivity.elev_high,
    elevLow: stravaDetailedActivity.elev_low,
    endLatlng: stravaDetailedActivity.end_latlng,
    country: stravaDetailedActivity.location_country,
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

  return detailedActivity;
}

export function fetchStreams(accessToken: string, activityId: string): Promise<StravatronStream[]> {

  return new Promise((resolve) => {

    const path = 'activities/' + activityId + '/streams/time,latlng,distance,altitude,grade_smooth,heartrate,cadence,watts';

    fetchStravaData(path, accessToken)
      .then((stravaStreams: StravaNativeStream[]) => {
        const stravatronStreams: StravatronStream[] = transformStravaStreams(stravaStreams);
        resolve(stravatronStreams);
      });
  });
}

function transformStravaStreams(stravaNativeStreams: StravaNativeStream[]): StravatronStream[] {

  const stravatronStreams: StravatronStream[] = [];
  for (const stravaNativeStream of stravaNativeStreams) {
    stravatronStreams.push({
      data: stravaNativeStream.data,
      originalSize: stravaNativeStream.original_size,
      resolution: stravaNativeStream.resolution,
      seriesType: stravaNativeStream.series_type,
      type: stravaNativeStream.type,
    });
  }
  return stravatronStreams;
}

export function fetchAllEfforts(accessToken: string, athleteId: string, segmentId: number): Promise<StravatronSegmentEffort[]> {

  return new Promise((resolve) => {

    const path = 'segments/' + segmentId.toString() + '/all_efforts?athlete_id=' + athleteId.toString() + '&per_page=200';

    const stravatronSegmentEfforts: StravatronSegmentEffort[] = [];
    fetchStravaData(path, accessToken)
      .then((stravaAllEfforts: StravaNativeDetailedSegmentEffort[]) => {
        for (const stravaEffort of stravaAllEfforts) {
          stravatronSegmentEfforts.push(transformStravaDetailedSegmentEffort(stravaEffort));
        }
        resolve(stravatronSegmentEfforts);
      });
  });
}

export function transformStravaDetailedSegmentEffort(stravaDetailedSegmentEffort: StravaNativeDetailedSegmentEffort): StravatronSegmentEffort {

  const nativeSummarySegment: StravaNativeSummarySegment = stravaDetailedSegmentEffort.segment;

  const achievements: StravatronAchievement[] = [];
  for (const achievement of stravaDetailedSegmentEffort.achievements) {
    achievements.push({
      achievementType: achievement.type,
      rank: achievement.rank,
      typeId: achievement.type_id,
    });
  }

  const stravatronSegmentEffort: StravatronSegmentEffort = {
    id: stravaDetailedSegmentEffort.id,
    segmentId: stravaDetailedSegmentEffort.segment.id,
    name: stravaDetailedSegmentEffort.name,
    activityId: stravaDetailedSegmentEffort.activity.id,
    elapsedTime: stravaDetailedSegmentEffort.elapsed_time,
    movingTime: stravaDetailedSegmentEffort.moving_time,
    startDateLocal: stravaDetailedSegmentEffort.start_date_local,
    distance: stravaDetailedSegmentEffort.distance,
    averageWatts: stravaDetailedSegmentEffort.average_watts,
    prRank: stravaDetailedSegmentEffort.pr_rank,
    achievements,
    averageCadence: stravaDetailedSegmentEffort.average_cadence,
    averageHeartrate: stravaDetailedSegmentEffort.average_heartrate,
    deviceWatts: stravaDetailedSegmentEffort.device_watts,
    maxHeartrate: stravaDetailedSegmentEffort.max_heartrate,
    startDate: stravaDetailedSegmentEffort.start_date,
    startIndex: stravaDetailedSegmentEffort.start_index,
    endIndex: stravaDetailedSegmentEffort.end_index,
    // komRank?: stravaDetailedSegment.kom_rank,
  };

  return stravatronSegmentEffort;
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
    allEffortsLoaded: false,
  };
  return stravatronDetailedSegment;
}

export function fetchSegmentEffort(accessToken: string, segmentEffortId: number): Promise<any> {

  return new Promise((resolve) => {

    const path = 'segment_efforts/' + segmentEffortId.toString() + '&per_page=100';

    fetchStravaData(path, accessToken)
      .then((stravaSegmentEffort) => {
        resolve(stravaSegmentEffort);
      });
  });
}


// retrieveBaseMapSegments
