export interface Athlete {
  id: string;
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StravaNativeActivity {

/*
"resource_state": 2,
"athlete": {
    "id": 2843574,
    "resource_state": 1
},
"name": "11/28/2013 Los Altos, CA",
"distance": 18451.6,
"moving_time": 3184,
"elapsed_time": 3184,
"total_elevation_gain": 377,
"type": "Ride",
"workout_type": null,
"id": 97593668,
"external_id": "2013-11-28-10-12-55.fit",
"upload_id": 106646973,
"start_date": "2013-11-28T18:12:55Z",
"start_date_local": "2013-11-28T10:12:55Z",
"timezone": "(GMT-08:00) America/Los_Angeles",
"utc_offset": -28800,
"start_latlng": [
  37.39,
  -122.15
],
"end_latlng": [
    37.37,
    -122.22
],
"location_city": "Los Altos",
"location_state": "CA",
"location_country": "United States",
"start_latitude": 37.39,
"start_longitude": -122.15,
"achievement_count": 0,
"kudos_count": 0,
"comment_count": 0,
"athlete_count": 1,
"photo_count": 0,
"map": {
  "id": "a97593668",
  "summary_polyline": "scfcF~_phVcBvBpFvLtVnFzEjH?jCwGvQwBb[bBjMvQfJ{@zTkHv[y@fOnAvLdJbL~RfEjCfESbGmPrNaDbGRnKrIvVxLvLvQnKpDzOfw@~sAnAf@`S_I`Bz@RfEwGfOR~MvGjMjHz@tNwG`BgErXwVfEwQf^{^f^cBjCkHbBg@?cGjCcLsDnF|@~MqFjHgY?c[fT_IvL{EnUwVrSwBvGcG~CkHnAcL_IoAwGz@oUoASsIf@sD~CsIz@oZfT_InAoAoPhEwL",
  "resource_state": 2
},
"trainer": false,
"commute": false,
"manual": false,
"private": false,
"visibility": "everyone",
"flagged": false,
"gear_id": null,
"from_accepted_tag": false,
"upload_id_str": "106646973",
"average_speed": 5.795,
"max_speed": 18.9,
"device_watts": false,
"has_heartrate": false,
"heartrate_opt_out": false,
"display_hide_heartrate_option": false,
"elev_high": 381,
"elev_low": 57,
"pr_count": 0,
"total_photo_count": 0,
"has_kudoed": false,
"description": "",
"kilojoules": 0,
"city": ""
*/
  id: number;
  athlete: any;
  average_speed: number;
  description: string;
  distance: number;
  elapsed_time: number;
  kilojoules: number;
  city: string;
  map: any;
  max_speed: number;
  moving_time: number;
  name: string;
  start_date_local: string;
  total_elevation_gain: number;
}

export interface Activity {
  id: number;
  athlete: any;
  averageSpeed: number;
  description: string;
  distance: number;
  elapsedTime: number;
  kilojoules: number;
  city: string;
  mapSummaryPolyline?: string;
  maxSpeed: number;
  movingTime: number;
  name: string;
  startDateLocal: string;
  totalElevationGain: number;
}