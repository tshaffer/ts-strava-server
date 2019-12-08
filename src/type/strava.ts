export interface StravaNativeMetaAthlete {
  id: number;
  resource_state: number;
}

// https://developers.strava.com/docs/reference/#api-models-SummaryAthlete
export interface StravaNativeSummaryAthlete {
  id: number;
  resource_state: number;
  firstname: string;
  lastname: string;
  // many others
}

export interface AthleteSegmentStats {
  effort_count: number;
  pr_date: Date;
  pr_elapsed_time: number;
}

export interface StravaNativeAchievement {
  rank: number;
  type: string;
  type_id: number;
}

// https://developers.strava.com/docs/reference/#api-models-LatLng
export interface StravaNativeLatLng {
  latlng: number[];
}

// https://developers.strava.com/docs/reference/#api-models-PolylineMap
export interface StravaNativePolylineMap {
  id: string;
  polyline: string;
  summary_polyline: string;
}

// https://developers.strava.com/docs/reference/#api-models-SummarySegment
export interface StravaNativeSummarySegment {
  id: number;
  name: string;
  activity_type: string;
  distance: number;
  average_grade: number;
  maximum_grade: number;
  elevation_high: number;
  elevation_low: number;
  start_latlng: StravaNativeLatLng;
  start_latitude: number;
  end_latitude: number;
  end_latlng: StravaNativeLatLng;
  start_longitude: number;
  end_longitude: number;
  climb_category: number;
  city?: string;
  state: string;
  country: string;
  private: boolean;
  athlete_pr_effort?: StravaNativeSummarySegmentEffort;
  resource_state: number;
  starred: boolean;
  hazardous: boolean;
}

// https://developers.strava.com/docs/reference/#api-models-DetailedSegment
export interface StravaNativeDetailedSegment extends StravaNativeSummarySegment {
  created_at: Date;
  updated_at: Date;
  total_elevation_gain: number;
  map: StravaNativePolylineMap; // **** no summary polyline
  effort_count: number;
  athlete_count: number;
  star_count: number;
  athlete_segment_stats?: AthleteSegmentStats;
}

// https://developers.strava.com/docs/reference/#api-models-SummarySegmentEffort
export interface StravaNativeSummarySegmentEffort {
  id: number;
  resource_state: number;
  elapsed_time: number;
  start_date: Date;
  start_date_local: Date;
  distance: number;
  is_kom?: boolean;
}

// https://developers.strava.com/docs/reference/#api-models-DetailedSegmentEffort
export interface StravaNativeDetailedSegmentEffort extends StravaNativeSummarySegmentEffort {
  name: string;
  activity: StravaNativeMetaActivity;
  athlete: StravaNativeMetaAthlete;
  moving_time: number;
  start_index: number;
  end_index: number;
  average_cadence: number;
  average_watts: number;
  device_watts: boolean;
  average_heartrate: number;
  max_heartrate: number;
  segment: StravaNativeSummarySegment;
  kom_rank?: any;
  pr_rank: number;
  achievements: StravaNativeAchievement[];
  hidden?: boolean;
}

export interface StravaNativeStream {
  data: any[];
  original_size: number;
  resolution: string;
  series_type: string;
  type: string;
}

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
