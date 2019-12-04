import { StravaNativeSummarySegmentEffort, StravaNativeSummaryAthlete, StravaNativeLatLng, StravaNativePolylineMap, StravaNativeDetailedSegmentEffort, StravaNativeMetaAthlete, StravatronSegmentEffort } from "./base";

export interface StravaNativeMetaActivity {
  id: number;
  resource_state: number;
}
// https://developers.strava.com/docs/reference/#api-models-SummaryActivity
export interface StravaNativeSummaryActivity {
  achievement_count: number;
  athlete: StravaNativeMetaAthlete;
  athlete_count: number;
  average_speed: number;
  average_temp?: number;
  average_watts: number;
  comment_count: number;
  commute: boolean;
  device_watts: boolean;
  display_hide_heartrate_option: boolean;
  distance: number;
  elapsed_time: number;
  elev_high?: number;
  elev_low?: number;
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
  location_city?: string; // always present but may be null
  location_country: string;
  location_state?: string; // always present but may be null
  manual: boolean;
  map: StravaNativePolylineMap; // **** does not include polyline
  max_speed: number;
  moving_time: number;
  name: string;
  photo_count: number;
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
  weighted_average_watts?: number;
  workout_type?: number;
}

// **** for detailed activity, map includes polyline

// https://developers.strava.com/docs/reference/#api-models-DetailedActivity
export interface StravaNativeDetailedActivity extends StravaNativeSummaryActivity {
  description: string;
  photos: any; // PhotosSummary
  gear: string; // SummaryGear
  calories: number;
  segment_efforts: StravaNativeDetailedSegmentEffort[];
  device_name: string;
  embed_token: string;
  splits_metric: any; // Split
  splits_standard: any; // Split
  laps: any; // Lap
  best_efforts?: any; // DetailedSegmentEffort or DetailedSegmentEffort[] ??
  average_cadence: number;
  average_heartrate: number;
  max_heartrate: number;
  max_watts: number;
  perceived_exertion: any;
  prefer_perceived_exertion: any;
}

export interface StravatronSummaryActivity {
  achievementCount: number;
  athleteId: number;
  averageSpeed: number;
  averageTemp?: number;
  averageWatts: number;
  deviceWatts: boolean;
  distance: number;
  elapsedTime: number;
  elevHigh?: number;
  elevLow?: number;
  endLatlng: StravaNativeLatLng;
  id: number;
  kilojoules: number;
  city?: string;
  country: string;
  state?: string;
  map: StravaNativePolylineMap; // does not include polyline
  maxSpeed: number;
  movingTime: number;
  name: string;
  prCount: number;
  resourceState: number;
  startDate: Date;
  startDateLocal: Date;
  startLatitude: number;
  startLatlng: StravaNativeLatLng;
  startLongitude: number;
  timezone: string;
  totalElevationGain: number;
  weightedAverageWatts?: number;
}

export interface StravatronDetailedActivity extends StravatronSummaryActivity {
  description: string;
  calories: number;
  segmentEfforts: StravatronSegmentEffort[];

  averageCadence: number;
  averageHeartrate: number;
  deviceName: string;
  hasHeartrate: boolean;
  maxHeartrate: number;
  maxWatts: number;
  type: string;
  utcOffset: number;

  bestEfforts?: any; // DetailedSegmentEffort or DetailedSegmentEffort[] ??
}

// ????
export interface StravatronDetailedActivityAttributes {
  calories: number;
  segmentEfforts: StravatronSegmentEffort[];
  map: StravaNativePolylineMap;
  streams: any[];
}
