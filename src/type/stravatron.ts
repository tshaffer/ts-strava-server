import { 
  StravaNativeLatLng, 
  StravaNativePolylineMap, 
} from './strava';

export type StravatronSegmentEffortsForSegment = StravatronSegmentEffort[];

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
  originalSize: number;
  resolution: string;
  seriesType: string;
  type: string;
}

export interface StravatronStreamData {
  timeData: any[];
  locationData: any[];
  elevationData: any[];
  distanceData: any[];
  gradientData: any[];
  cadenceData: any[];
  heartrateData: any[];
  wattsData: any[];
}

export interface StravatronSummaryActivity {
  achievementCount: number;
  athleteId: number;
  averageSpeed: number;
  averageTemp?: number;
  averageWatts: number;
  deviceWatts?: boolean;
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

export interface StravatronDetailedActivityData {
  detailedActivityAttributes: StravatronDetailedActivityAttributes;
  locationData: any[];
  segments: StravatronSummarySegment[];
  detailedSegments: StravatronDetailedSegment[];
  segmentEfforts: StravatronSegmentEffort[];
  segmentEffortsInActivity: StravatronSegmentEffort[];
}
