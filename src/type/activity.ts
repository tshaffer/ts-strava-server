import { StravaNativeSummarySegmentEffort, StravaNativeSummaryAthlete, StravaNativeLatLng, StravaNativePolylineMap, StravaNativeDetailedSegmentEffort } from "./base";

export interface StravaNativeMetaActivity {
  id: number;
  resource_state: number;
}

// https://developers.strava.com/docs/reference/#api-models-SummaryActivity
// TEDTODO - some of the properties here may in fact only be in the detailed activity
export interface StravaNativeSummaryActivity {
  achievement_count: number;
  athlete: any; // MetaAthlete??, but really { id, resource_state }
  athlete_count: number;
  average_cadence: number;
  average_heartrate: number;
  average_speed: number;
  average_temp: number;
  average_watts: number;
  comment_count: number;
  commute: boolean;
  device_watts: boolean;
  display_hide_heartrate_option: boolean;
  distance: number;
  elapsed_time: number;
  elev_high: number;
  elev_low: number;
  end_latlng: StravaNativeLatLng;
  external_id: string;
  flagged: boolean;
  from_accepted_tag: boolean;
  gear_id: string;
  has_heartrate: boolean;
  has_kudoed: boolean;
  heartrate_opt_out: boolean;
  id: number;
  kilojoules: number;
  kudos_count: number;
  location_city: string;
  location_country: string;
  location_state: string;
  manual: boolean;
  map: StravaNativePolylineMap;
  max_speed: number;
  max_heartrate: number;
  max_watts: number;
  moving_time: number;
  name: string;
  perceived_exertion: any;
  photo_count: number;
  prefer_perceived_exertion: any;
  pr_count: number;
  private: boolean;
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
export interface StravaNativeDetailedActivity extends StravaNativeSummaryActivity {
  description: string;
  photos: any; // PhotosSummary
  gear: string; // SummaryGear
  calories: number;
  segment_efforts: StravaNativeDetailedSegmentEffort[]; // DetailedSegmentEffort
  device_name: string;
  embed_token: string;
  splits_metric: any; // Split
  splits_standard: any; // Split
  laps: any; // Lap
  best_efforts: any; // DetailedSegmentEffort
}

export interface StravatronSummaryActivity {
  achievementCount: number;
  athleteId: number;
  averageSpeed: number;
  averageTemp: number;
  averageWatts: number;
  deviceWatts: boolean;
  distance: number;
  elapsedTime: number;
  elevHigh: number;
  elevLow: number;
  endLatlng: StravaNativeLatLng;
  id: number;
  kilojoules: number;
  city: string;
  country: string;
  state: string;
  map: StravaNativePolylineMap;
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
  timezone: string;
  totalElevationGain: number;
  weightedAverageWatts: number;
}

export interface StravatronDetailedActivity extends StravatronSummaryActivity {
  description: string;
  calories: number;
  segment_efforts: any; // DetailedSegmentEffort
}
