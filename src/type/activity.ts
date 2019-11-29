import { StravaNativeSummarySegmentEffort, StravaNativeSummaryAthlete, StravaNativeLatLng, StravaNativePolylineMap, StravaNativeDetailedSegmentEffort, StravaNativeMetaAthlete } from "./base";

export interface StravaNativeMetaActivity {
  id: number;
  resource_state: number;
}
/*
{ resource_state: 2,
  athlete: { id: 2843574, resource_state: 1 },
  name: 'Wilder with Lori',
  distance: 17740.9,
  moving_time: 5758,
  elapsed_time: 8479,
  total_elevation_gain: 423,
  type: 'Ride',
  workout_type: 10,
  id: 2836726906,
  external_id: 'garmin_push_4216601163',
  upload_id: 3006890783,
  start_date: '2019-11-02T16:58:21Z',
  start_date_local: '2019-11-02T09:58:21Z',
  timezone: '(GMT-08:00) America/Los_Angeles',
  utc_offset: -25200,
  start_latlng: [ 36.96, -122.09 ],
  end_latlng: [ 36.96, -122.09 ],
  location_city: null,
  location_state: null,
  location_country: 'United States',
  start_latitude: 36.96,
  start_longitude: -122.09,
  achievement_count: 4,
  kudos_count: 1,
  comment_count: 0,
  athlete_count: 2,
  photo_count: 0,
  map: 
   { id: 'a2836726906',
     summary_polyline: '{wq`F|xchVOU_AW|@iI@iA_@g@kBRwB`EyA~@iBh@cDZiAAmCaA_D_BuB[_AeAiDPgCWIEDOmB_@qBT{Ai@iCNcC~@qCXaAp@aBg@kBQKSBw@mAw@cBaBeAoCCuE_@g@mAm@iAO}FGi@KgAs@D|@v@zBq@l@kAEGd@VfAm@lA_CJxCbFDXUz@gBXq@s@qAK{@Za@a@yA]O_@e@yDs@jEmA~@sBl@~A{AF_@IoBQk@w@oB}AcCa@SqAAq@QWNeAbCSz@Lx@hAjBV`AXpCIl@qAUgBRqDrAiAAcFiBc@_C]uQLaFNaALWhBFtCK|EbBbAp@nAvCx@d@K`BSLcA|BUlANr@fAfBVlAR~BQt@w@OoBHcAj@{Cp@}Cs@uAk@c@`@s@CyAgAWq@w@e@CpBGr@Un@Ej@q@jAc@^{CCwAx@]BjBZPNX|@dCfAfBVJn@cAtAkATsAM_CmA}AEuFt@u@f@mGh@e@\\Yp@hAbBhCi@\\@d@h@j@L|Ac@~@ChG`DTn@SrBf@fA_@rA}@\\mAo@qBN`BbCXPx@NhD|AbAC@R{@vBcAvGsAdD}@fD?L`ATm@hCsAfDiAfF_@hEQp@HlCkAh@}AlDeAjA_@dCK~CSV}@Dw@lAqANa@f@[FQd@Jf@vA_@rBx@ZAb@_@^TFNC~@Lf@`ApBGp@q@[GDBd@Rr@b@`@|@KSnBV~BbCdGDVGVPSoCmGWwB`@oAwByA[u@@Qn@h@R@Hi@aAcDGa@Dq@[e@OAW\\YA{Bu@a@H]^i@GJkAvCoA`@eAtAUP_B?gA`@gCfAoAfAoCl@k@l@[z@vBM`BFzD`BzCPHv@gBjAmENaCs@mCG{@`@mEN_@zB}Bn@STWcCy@M_Ae@[p@yCbAeAJaAd@yAPiAt@g@tADf@]rCUJm@`CkD\\u@l@oC\\mDjAiAzBs@hCXrAj@~C?`@ElCsBfCyEEiA\\}@NaBOgCFc@d@o@d@qAf@a@tEiApBPpB{ATAv@r@h@ClIwCvAsAZGfC`@jBx@|ATf@n@`AvCRXl@TrAChCiBfAQzClAbFl@zItBvH@|@[rB_Cf@cA?m@c@mBo@gAeD_CoAc@bBBdDrA~FGhBq@~AaAfA}Ah@uArB]V\\C~Ay@tGRv@z@PMN',
     resource_state: 2 },
  trainer: false,
  commute: false,
  manual: false,
  private: false,
  visibility: 'everyone',
  flagged: false,
  gear_id: 'b1803050',
  from_accepted_tag: false,
  upload_id_str: '3006890783',
  average_speed: 3.081,
  max_speed: 9.7,
  average_temp: 16,
  average_watts: 97.5,
  kilojoules: 561.4,
  device_watts: false,
  has_heartrate: false,
  heartrate_opt_out: false,
  display_hide_heartrate_option: false,
  elev_high: 194.4,
  elev_low: 3.8,
  pr_count: 1,
  total_photo_count: 0,
  has_kudoed: false }
*/
// https://developers.strava.com/docs/reference/#api-models-SummaryActivity
// TEDTODO - some of the properties here may in fact only be in the detailed activity
export interface StravaNativeSummaryActivity {
  achievement_count: number;
  athlete: StravaNativeMetaAthlete;
  athlete_count: number;
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
  workout_type: number;
}

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
  best_efforts: any; // DetailedSegmentEffort
  average_cadence: number;
  average_heartrate: number;
  max_heartrate: number;
  max_watts: number;
  perceived_exertion: any;
  prefer_perceived_exertion: any;
  weighted_average_watts: number;
}

export interface StravatronSummaryActivity {
  achievementCount: number;
  athleteId: number;
  averageSpeed: number;
  // averageTemp: number;
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
  resourceState: number;
  startDate: Date;
  startDateLocal: Date;
  startLatitude: number;
  startLatlng: StravaNativeLatLng;
  startLongitude: number;
  timezone: string;
  totalElevationGain: number;
}

export interface StravatronDetailedActivity extends StravatronSummaryActivity {
  description: string;
  calories: number;
  segmentEfforts: any; // DetailedSegmentEffort
  weightedAverageWatts: number;

  averageCadence: number;
  averageHeartrate: number;
  deviceName: string;
  hasHeartrate: boolean;
  maxHeartrate: number;
  maxWatts: number;
  type: string;
  utcOffset: number;
}
