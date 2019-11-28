export interface StravaNativeAthlete {
  id: number;
  resource_state: number;
}

export interface StravaNativeLatLng {
  latlng: number[];
}

export interface StravaNativeMap {
  id: string;
  summary_polyline: string;
  resource_state: number;
}

export interface Athlete {
  id: string;
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StravaNativeSegment {
  id: number;
  name: string;
  distance: number;
  average_grade: number;
  maximum_grade: number;
  elevation_high: number;
  elevation_low: number;
}

export interface StravaNativeAchievement {
  type: string;
  rank: number;
}

export interface StravaNativeSegmentEffort {
  id: number;
  name: string;
  activity: any; // id: number
  athlete: any; // id: number
  elapsed_time: number;
  moving_time: number;
  start_date: Date;
  start_date_local: Date;
  distance: number;
  start_index: number;
  end_index: number;
  average_watts: number;
  segment: StravaNativeSegment;
  pr_rank: number;
  achievements: StravaNativeAchievement[];
}

export interface Segment {
  id: number;
  name: string;
  distance: number;
  averageGrade: number;
  maximumGrade: number;
  elevationHigh: number;
  elevationLow: number;
}

export interface Achievement {
  type: string;
  rank: number;
}

export interface SegmentEffort {
  id: number;
  name: string;
  activityId: string;
  elapsedTime: number;
  movingTime: number;
  startDateLocal: Date;
  distance: number;
  averageWatts: number;
  segment: Segment;
  prRank: number;
  achievements: Achievement[];
}

export interface DetailedActivity extends Activity {
  mapPolyline: string;
  averageTemp: string;
  averageWatts: string;
  segmentEfforts: SegmentEffort[];
}
