import { StravaNativeSegmentEffort, StravaNativeAthlete, StravaNativeLatLng, StravaNativeMap } from "./base";

// https://developers.strava.com/docs/reference/#api-models-SummaryActivity
export interface StravaNativeActivity {
  achievement_count: number;
  athlete: StravaNativeAthlete;
  athlete_count: number;
  average_speed: number;
  average_temp: number;
  average_watts: number;
  comment_count: number;
  commute: boolean;
  device_watts: boolean;
  display_hide_heartrate_option: number;
  distance: number;
  elapsed_time: number;
  elev_high: number;
  elev_low: number;
  end_latlng: StravaNativeLatLng;
  external_id: string;
  flagged: number;
  from_accepted_tag: number;
  gear_id: string;
  has_heartrate: number;
  has_kudoed: number;
  heartrate_opt_out: number;
  id: number;
  kilojoules: number;
  kudos_count: number;
  location_city: string;
  location_country: string;
  location_state: string;
  manual: number;
  map: StravaNativeMap;
  max_speed: number;
  moving_time: number;
  name: string;
  photo_count: number;
  pr_count: number;
  private: number;
  resource_state: number;
  start_date: Date;
  start_date_local: Date;
  start_latitude: number;
  start_latlng: StravaNativeLatLng;
  start_longitude: number;
  timezone: string;
  total_elevation_gain: number;
  total_photo_count: number;
  trainer: number;
  type: string;
  upload_id: number;
  upload_id_str: string;
  utc_offset: number;
  visibility: string;
  workout_type: number;
  weighted_average_watts: number;
}

// https://developers.strava.com/docs/reference/#api-models-DetailedActivity
export interface StravaNativeDetailedActivity extends StravaNativeActivity {
  description: string;
  photos: any; // PhotosSummary
  gear: string; // SummaryGear
  calories: number;
  segment_efforts: any; // DetailedSegmentEffort
  device_name: string;
  embed_token: string;
  splits_metric: any; // Split
  splits_standard: any; // Split
  laps: any; // Lap
  best_efforts: any; // DetailedSegmentEffort
}

export interface StravatronActivity {
  id: number;
  achievementCount: number;
  athleteId: number; // TEDTODO ??
  averageSpeed: number;
  averageTemp: number;
  averageWatts: number;
  deviceWatts: boolean;
  distance: number;
  elapsedTime: number;
  elevHigh: number;
  elevLow: number;
  end_latlng: StravaNativeLatLng;
  kilojoules: number;
  city: string;
  country: string;
  state: string;
  map: StravaNativeMap;
  maxSpeed: number;
  movingTime: number;
  name: string;
  prCount: number;
  resource_state: number;
  startDate: Date;
  startDateLocal: Date;
  startLatitude: number;
  startLatlng: StravaNativeLatLng;
  startLongitude: number;
  timezone: string; // ??
  totalElevationGain: number;


  description: string;
  city: string;
  mapSummaryPolyline?: string;
  maxSpeed: number;
  movingTime: number;
  startDateLocal: string;
  totalElevationGain: number;
}

