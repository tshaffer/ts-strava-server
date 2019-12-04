import { StravaNativeMetaActivity } from './activity';

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
  city: string;
  state: string;
  country: string;
  private: boolean;
  athlete_pr_effort?: StravaNativeSummarySegmentEffort;
  resource_state: number;
  starred: boolean;
}

// https://developers.strava.com/docs/reference/#api-models-DetailedSegment
export interface StravaNativeDetailedSegment extends StravaNativeSummarySegment {
  created_at: Date;
  updated_at: Date;
  total_elevation_gain: number;
  map: StravaNativePolylineMap;
  effort_count: number;
  athlete_count: number;
  hazardous: boolean;
  star_count: number;
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
  kom_rank: any;
  pr_rank: any;
  achievements: StravaNativeAchievement[];
  hidden: boolean;
}

export interface StravatronAthlete {
  id: string;
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StravatronSummarySegment {
  id: number;
  name: string;
  distance: number;
  averageGrade: number;
  maximumGrade: number;
  elevationHigh: number;
  elevationLow: number;
  activityType: string;
  climbCategory: number;
  startLatlng: StravaNativeLatLng;
  endLatlng: StravaNativeLatLng;
  athletePrEffort?: any; // ****
}

export interface StravatronDetailedSegment extends StravatronSummarySegment {
  totalElevationGain: number;
  map: StravaNativePolylineMap;
  effortCount: number;
}

export interface StravatronAchievement {
  type: string;
  rank: number;
  typeId: number;
}

export interface StravatronSegmentEffort {
  id: number;
  name: string;
  activityId: number;
  elapsedTime: number;
  movingTime: number;
  startDateLocal: Date;
  distance: number;
  averageWatts: number;
  segment: StravatronSummarySegment;
  prRank: number;
  achievements: StravatronAchievement[];
  averageCadence: number;
  averageHeartrate: number;
  deviceWatts: boolean;
  maxHeartrate: number;
  startDate: Date;
  komRank?: number;
}

export interface StravatronStream {
  data: any[];
  original_size: number;
  resolution: string;
  series_type: string;
  type: string;
}

export interface StravatronStreamData {
  timeData: any[];
  locationData: any[];
  elevationData: any[];
  distanceData: any[];
  gradientData: any[];
}
