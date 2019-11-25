export interface Athlete {
  id: string;
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StravaNativeActivity {

  /*
  resource_state: 2,
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
  athleteId: number;
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

/*
{
    "resource_state": 3,
    "athlete": {
        "id": 2843574,
        "resource_state": 1
    },
    "name": "Wilder with Lori",
    "distance": 17740.9,
    "moving_time": 5758,
    "elapsed_time": 8479,
    "total_elevation_gain": 423,
    "type": "Ride",
    "workout_type": 10,
    "id": 2836726906,
    "external_id": "garmin_push_4216601163",
    "upload_id": 3006890783,
    "start_date": "2019-11-02T16:58:21Z",
    "start_date_local": "2019-11-02T09:58:21Z",
    "timezone": "(GMT-08:00) America/Los_Angeles",
    "utc_offset": -25200,
    "start_latlng": [
        36.96,
        -122.09
    ],
    "end_latlng": [
        36.96,
        -122.09
    ],
    "location_city": null,
    "location_state": null,
    "location_country": "United States",
    "start_latitude": 36.96,
    "start_longitude": -122.09,
    "achievement_count": 4,
    "kudos_count": 1,
    "comment_count": 0,
    "athlete_count": 2,
    "photo_count": 0,
    "map": {
        "id": "a2836726906",
Add        "polyline": "{wq`F|xchV?EOO_AWBq@f@aDPuB@iA_@g@kBRiA|Bm@bAyA~@iBh@eBV}@BiAAmCaA_D_BuAW_@C_AeAiDPkAO{@GIEAEFE?CSIa@Aw@SuAL[FUGeAa@cA@eAL}Af@e@Vg@D_@H]Ck@L[RUTOF_A]a@Iy@Aq@OIGAKBO?g@mAw@iAqAYOeAoCGkBDcAAe@_@g@i@Uc@WiAO[C{@DeDIi@KgAs@CP@TFTf@pANh@q@l@W@s@GGZ?HVfAm@lAq@@mAHpAvBZ`@j@hADXUz@u@Rq@Dq@s@y@MW@{@Za@a@mAUKGIIEUUeCOs@KXg@pDOPOBOJ]\\kBn@GA~A{AF_@IoBQk@w@oBi@o@s@sAa@Sk@Ee@B_@IQGMBIJeAbCSz@Lx@hAjBV`AL`AJnAIl@s@S]AgBRSLqBj@k@Xa@Dg@GsBm@s@_@q@SIGc@_CGkAUiOLaFNaALW^En@LX?j@KhB?bAZbAb@tAb@bAp@nAvCl@TJNK`BSLUd@m@vAIZKp@Nr@fAfBPr@PvAF`AQt@]KYCoBHcAj@gCr@SA}Cs@a@U[MWGE@MROJYBYGa@YWY_@SMc@IMm@c@IAGNA^D`AGr@K\\IPEj@Y^Wj@c@^]ByAGc@?OFUTa@NOJODMAPHL@XJb@CLFPNJj@LPpAh@r@\\^Jt@DPDHT@XGDAJU^OPSPkATsAMqAw@YEKKGC_@I}@Bk@H[JK?y@Ny@BWJU?u@f@yAJa@JqCPe@\\Yp@^h@^b@HTHCPAlBc@\\@RJP\\j@L|Ac@t@E^JdAp@dCbARLRRTn@Gp@ITAj@f@fACTOl@KNKHe@PK@][o@SO@YHa@Ae@DRb@lA~AXP\\JZBb@Tb@Lh@`@v@Vf@IZD@B?N{@vBc@|C_@xBc@~@o@dBe@tBQj@ED?LLBPAJBTNOd@O`AM`@sAfDk@|B]hBK|@SjCQp@HlCGC[Ng@\\g@pAu@zAi@`@[h@Q|@MfACrBGj@SVSFi@Ae@~@QL_@Ji@@G@a@f@[FQd@Jf@bA_@R?rBx@ZAb@_@^TFNCh@?TLf@`ApB?XGVUGEIUIGDBd@Rr@b@`@|@K?^Q|@APN~AF^Rn@lAhC`@jADVGVPSOSu@{Bc@y@MMWu@WyA?]Ja@Tm@]SEAsAcA[u@AKBENF^`@R@Hi@]gAUaAMYGa@F[AU[e@OAW\\YA_@KiAg@QAa@H]^i@GHcA@GPE\\[nA_@VMNSN]@SPEz@IFEFMHqA?gATeBJa@fAoARe@`@u@Ps@l@k@l@[FFr@nBM`B@vCDb@b@r@|@fBJLDCJa@RUVo@t@eCTgA@a@L_BIYMW[{AEUAe@`@mEHWDGtAsAd@i@n@STWGIo@Oa@Si@KM_Ae@[Ni@Fm@XaAbAeAFQBo@Li@Vo@PiAJOh@WVCV@d@Ff@]`@GlBKBAJm@`@q@RSb@s@f@q@Pe@JOl@oC\\mD^i@j@_@r@WfA[\\HT@T?~@Lr@\\^L~C?`@E|AgAn@k@NOd@cAZe@t@_BBSIu@\\}@NaBEiA@GKk@@UDWJUXYRe@Pk@LQXOtEiAT?\\Lb@FXCVKROn@o@TOTAb@d@RLh@Cx@Y`@ExAk@d@ObAi@l@Qh@_@l@s@FERAx@RlALj@P~@f@JDr@D\\Hf@n@`AvCRXl@Tl@Bd@Gn@c@X]~@g@|@QH?d@H`Bz@RFlB\\tBNfBh@lBXdCp@pBBdEAj@OPKz@}@v@aAXg@L[?m@My@Us@O[_@k@i@c@{B{Aq@Q]QHEbADTBh@Pp@V`@Tf@RfBDvCMhBq@r@_@j@a@Zi@j@s@h@uArB]RLBNC~AMzAk@xDRv@z@PMN",
        "resource_state": 3,
        "summary_polyline": "{wq`F|xchVOU_AW|@iI@iA_@g@kBRwB`EyA~@iBh@cDZiAAmCaA_D_BuB[_AeAiDPgCWIEDOmB_@qBT{Ai@iCNcC~@qCXaAp@aBg@kBQKSBw@mAw@cBaBeAoCCuE_@g@mAm@iAO}FGi@KgAs@D|@v@zBq@l@kAEGd@VfAm@lA_CJxCbFDXUz@gBXq@s@qAK{@Za@a@yA]O_@e@yDs@jEmA~@sBl@~A{AF_@IoBQk@w@oB}AcCa@SqAAq@QWNeAbCSz@Lx@hAjBV`AXpCIl@qAUgBRqDrAiAAcFiBc@_C]uQLaFNaALWhBFtCK|EbBbAp@nAvCx@d@K`BSLcA|BUlANr@fAfBVlAR~BQt@w@OoBHcAj@{Cp@}Cs@uAk@c@`@s@CyAgAWq@w@e@CpBGr@Un@Ej@q@jAc@^{CCwAx@]BjBZPNX|@dCfAfBVJn@cAtAkATsAM_CmA}AEuFt@u@f@mGh@e@\\Yp@hAbBhCi@\\@d@h@j@L|Ac@~@ChG`DTn@SrBf@fA_@rA}@\\mAo@qBN`BbCXPx@NhD|AbAC@R{@vBcAvGsAdD}@fD?L`ATm@hCsAfDiAfF_@hEQp@HlCkAh@}AlDeAjA_@dCK~CSV}@Dw@lAqANa@f@[FQd@Jf@vA_@rBx@ZAb@_@^TFNC~@Lf@`ApBGp@q@[GDBd@Rr@b@`@|@KSnBV~BbCdGDVGVPSoCmGWwB`@oAwByA[u@@Qn@h@R@Hi@aAcDGa@Dq@[e@OAW\\YA{Bu@a@H]^i@GJkAvCoA`@eAtAUP_B?gA`@gCfAoAfAoCl@k@l@[z@vBM`BFzD`BzCPHv@gBjAmENaCs@mCG{@`@mEN_@zB}Bn@STWcCy@M_Ae@[p@yCbAeAJaAd@yAPiAt@g@tADf@]rCUJm@`CkD\\u@l@oC\\mDjAiAzBs@hCXrAj@~C?`@ElCsBfCyEEiA\\}@NaBOgCFc@d@o@d@qAf@a@tEiApBPpB{ATAv@r@h@ClIwCvAsAZGfC`@jBx@|ATf@n@`AvCRXl@TrAChCiBfAQzClAbFl@zItBvH@|@[rB_Cf@cA?m@c@mBo@gAeD_CoAc@bBBdDrA~FGhBq@~AaAfA}Ah@uArB]V\\C~Ay@tGRv@z@PMN"
    },
    "trainer": false,
    "commute": false,
    "manual": false,
    "private": false,
    "visibility": "everyone",
    "flagged": false,
    "gear_id": "b1803050",
    "from_accepted_tag": false,
    "upload_id_str": "3006890783",
    "average_speed": 3.081,
    "max_speed": 9.7,
Add    "average_temp": 16,
Add    "average_watts": 97.5,
    "kilojoules": 561.4,
    "device_watts": false,
    "has_heartrate": false,
    "heartrate_opt_out": false,
    "display_hide_heartrate_option": false,
    "elev_high": 194.4,
    "elev_low": 3.8,
    "pr_count": 1,
    "total_photo_count": 0,
    "has_kudoed": false,
    "description": "",
    MISSING CITY
    EVERYTHING BELOW ADDED
    "calories": 744,
    "perceived_exertion": null,
    "prefer_perceived_exertion": null,
    "segment_efforts": [
        {
            "id": 70578909670,
            "resource_state": 2,
            "name": "Engelsmans Climb 2019 Reroute Cattle Xing to Bench",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 1228,
            "moving_time": 1228,
            "start_date": "2019-11-02T17:02:32Z",
            "start_date_local": "2019-11-02T10:02:32Z",
            "distance": 3297.3,
            "start_index": 24,
            "end_index": 205,
            "device_watts": false,
            "average_watts": 137,
            "segment": {
                "id": 20683732,
                "resource_state": 2,
                "name": "Engelsmans Climb 2019 Reroute Cattle Xing to Bench",
                "activity_type": "Ride",
                "distance": 3371,
                "average_grade": 4.1,
                "maximum_grade": 14.8,
                "elevation_high": 162.6,
                "elevation_low": 21,
                "start_latlng": [
                    36.962779,
                    -122.084658
                ],
                "end_latlng": [
                    36.981918,
                    -122.080648
                ],
                "start_latitude": 36.962779,
                "start_longitude": -122.084658,
                "end_latitude": 36.981918,
                "end_longitude": -122.080648,
                "climb_category": 1,
                "city": null,
                "state": null,
                "country": null,
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": 3,
            "achievements": [
                {
                    "type_id": 3,
                    "type": "pr",
                    "rank": 3
                }
            ],
            "hidden": false
        },
        {
            "id": 70578909638,
            "resource_state": 2,
            "name": "New Lower Engelsmans climb",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 679,
            "moving_time": 679,
            "start_date": "2019-11-02T17:04:05Z",
            "start_date_local": "2019-11-02T10:04:05Z",
            "distance": 1584.7,
            "start_index": 36,
            "end_index": 134,
            "device_watts": false,
            "average_watts": 138.7,
            "segment": {
                "id": 20843587,
                "resource_state": 2,
                "name": "New Lower Engelsmans climb",
                "activity_type": "Ride",
                "distance": 1610.4,
                "average_grade": 5.4,
                "maximum_grade": 20.3,
                "elevation_high": 120.6,
                "elevation_low": 32.8,
                "start_latlng": [
                    36.966283,
                    -122.083457
                ],
                "end_latlng": [
                    36.977093,
                    -122.080871
                ],
                "start_latitude": 36.966283,
                "start_longitude": -122.083457,
                "end_latitude": 36.977093,
                "end_longitude": -122.080871,
                "climb_category": 1,
                "city": "Santa Cruz",
                "state": "California",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": 3,
            "achievements": [
                {
                    "type_id": 3,
                    "type": "pr",
                    "rank": 3
                }
            ],
            "hidden": false
        },
        {
            "id": 70578909661,
            "resource_state": 2,
            "name": "Englesman Singletrack Climb (new reroute)",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 440,
            "moving_time": 440,
            "start_date": "2019-11-02T17:15:28Z",
            "start_date_local": "2019-11-02T10:15:28Z",
            "distance": 1273.2,
            "start_index": 136,
            "end_index": 203,
            "device_watts": false,
            "average_watts": 140.3,
            "segment": {
                "id": 762661,
                "resource_state": 2,
                "name": "Englesman Singletrack Climb (new reroute)",
                "activity_type": "Ride",
                "distance": 1295.06,
                "average_grade": 3.7,
                "maximum_grade": 21.9,
                "elevation_high": 136.4,
                "elevation_low": 89,
                "start_latlng": [
                    36.97710430249572,
                    -122.08105604164302
                ],
                "end_latlng": [
                    36.98174670338631,
                    -122.08078321069479
                ],
                "start_latitude": 36.97710430249572,
                "start_longitude": -122.08105604164302,
                "end_latitude": 36.98174670338631,
                "end_longitude": -122.08078321069479,
                "climb_category": 0,
                "city": "Santa Cruz",
                "state": "CA",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": null,
            "achievements": [],
            "hidden": false
        },
        {
            "id": 70578909679,
            "resource_state": 2,
            "name": "Wild Boar",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 220,
            "moving_time": 220,
            "start_date": "2019-11-02T17:23:12Z",
            "start_date_local": "2019-11-02T10:23:12Z",
            "distance": 681.8,
            "start_index": 208,
            "end_index": 254,
            "device_watts": false,
            "average_watts": 119,
            "segment": {
                "id": 4888789,
                "resource_state": 2,
                "name": "Wild Boar",
                "activity_type": "Ride",
                "distance": 729.9,
                "average_grade": 2.2,
                "maximum_grade": 22.7,
                "elevation_high": 172.6,
                "elevation_low": 148.2,
                "start_latlng": [
                    36.982069,
                    -122.080861
                ],
                "end_latlng": [
                    36.985228,
                    -122.083926
                ],
                "start_latitude": 36.982069,
                "start_longitude": -122.080861,
                "end_latitude": 36.985228,
                "end_longitude": -122.083926,
                "climb_category": 0,
                "city": "United States",
                "state": "CA",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": null,
            "achievements": [],
            "hidden": false
        },
        {
            "id": 70578909687,
            "resource_state": 2,
            "name": "Wild Boar",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 685,
            "moving_time": 227,
            "start_date": "2019-11-02T17:33:12Z",
            "start_date_local": "2019-11-02T10:33:12Z",
            "distance": 684,
            "start_index": 297,
            "end_index": 339,
            "device_watts": false,
            "average_watts": 114,
            "segment": {
                "id": 4888789,
                "resource_state": 2,
                "name": "Wild Boar",
                "activity_type": "Ride",
                "distance": 729.9,
                "average_grade": 2.2,
                "maximum_grade": 22.7,
                "elevation_high": 172.6,
                "elevation_low": 148.2,
                "start_latlng": [
                    36.982069,
                    -122.080861
                ],
                "end_latlng": [
                    36.985228,
                    -122.083926
                ],
                "start_latitude": 36.982069,
                "start_longitude": -122.080861,
                "end_latitude": 36.985228,
                "end_longitude": -122.083926,
                "climb_category": 0,
                "city": "United States",
                "state": "CA",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": null,
            "achievements": [],
            "hidden": false
        },
        {
            "id": 70578909804,
            "resource_state": 2,
            "name": "Old Cabin complete",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 2056,
            "moving_time": 1183,
            "start_date": "2019-11-02T17:44:43Z",
            "start_date_local": "2019-11-02T10:44:43Z",
            "distance": 3236.4,
            "start_index": 340,
            "end_index": 608,
            "device_watts": false,
            "average_watts": 102.3,
            "segment": {
                "id": 888774,
                "resource_state": 2,
                "name": "Old Cabin complete",
                "activity_type": "Ride",
                "distance": 3369.18,
                "average_grade": -0.1,
                "maximum_grade": 44.6,
                "elevation_high": 197.6,
                "elevation_low": 118.3,
                "start_latlng": [
                    36.985332,
                    -122.083919
                ],
                "end_latlng": [
                    36.989597,
                    -122.099743
                ],
                "start_latitude": 36.985332,
                "start_longitude": -122.083919,
                "end_latitude": 36.989597,
                "end_longitude": -122.099743,
                "climb_category": 0,
                "city": "Santa Cruz",
                "state": "CA",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": true
            },
            "kom_rank": null,
            "pr_rank": null,
            "achievements": [],
            "hidden": false
        },
        {
            "id": 70578909696,
            "resource_state": 2,
            "name": "Log Cabin Down E to W",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 166,
            "moving_time": 166,
            "start_date": "2019-11-02T17:44:48Z",
            "start_date_local": "2019-11-02T10:44:48Z",
            "distance": 538.3,
            "start_index": 341,
            "end_index": 401,
            "device_watts": false,
            "average_watts": 61.3,
            "segment": {
                "id": 10143951,
                "resource_state": 2,
                "name": "Log Cabin Down E to W",
                "activity_type": "Ride",
                "distance": 520.8,
                "average_grade": -9.7,
                "maximum_grade": -1.5,
                "elevation_high": 173.8,
                "elevation_low": 123.2,
                "start_latlng": [
                    36.985466,
                    -122.08409
                ],
                "end_latlng": [
                    36.988015,
                    -122.085192
                ],
                "start_latitude": 36.985466,
                "start_longitude": -122.08409,
                "end_latitude": 36.988015,
                "end_longitude": -122.085192,
                "climb_category": 0,
                "city": "Santa Cruz",
                "state": "California",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": null,
            "achievements": [],
            "hidden": false
        },
        {
            "id": 70578909737,
            "resource_state": 2,
            "name": "Old Log Cabin Full down - up",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 645,
            "moving_time": 645,
            "start_date": "2019-11-02T17:44:48Z",
            "start_date_local": "2019-11-02T10:44:48Z",
            "distance": 1468.2,
            "start_index": 341,
            "end_index": 488,
            "device_watts": false,
            "average_watts": 122.8,
            "segment": {
                "id": 3974284,
                "resource_state": 2,
                "name": "Old Log Cabin Full down - up",
                "activity_type": "Ride",
                "distance": 1513.1,
                "average_grade": 1.4,
                "maximum_grade": 50.3,
                "elevation_high": 196.8,
                "elevation_low": 119,
                "start_latlng": [
                    36.985448,
                    -122.084026
                ],
                "end_latlng": [
                    36.991443,
                    -122.088128
                ],
                "start_latitude": 36.985448,
                "start_longitude": -122.084026,
                "end_latitude": 36.991443,
                "end_longitude": -122.088128,
                "climb_category": 0,
                "city": "Santa Cruz",
                "state": "CA",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": null,
            "achievements": [],
            "hidden": false
        },
        {
            "id": 70578909762,
            "resource_state": 2,
            "name": "North Log Cabin Trail",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 501,
            "moving_time": 501,
            "start_date": "2019-11-02T17:47:12Z",
            "start_date_local": "2019-11-02T10:47:12Z",
            "distance": 963.9,
            "start_index": 398,
            "end_index": 488,
            "device_watts": false,
            "average_watts": 143.4,
            "segment": {
                "id": 2411,
                "resource_state": 2,
                "name": "North Log Cabin Trail",
                "activity_type": "Ride",
                "distance": 1032.89,
                "average_grade": 7.8,
                "maximum_grade": 73.5,
                "elevation_high": 199.6,
                "elevation_low": 118.9,
                "start_latlng": [
                    36.9882585,
                    -122.08532
                ],
                "end_latlng": [
                    36.9914384,
                    -122.0881419
                ],
                "start_latitude": 36.9882585,
                "start_longitude": -122.08532,
                "end_latitude": 36.9914384,
                "end_longitude": -122.0881419,
                "climb_category": 1,
                "city": "Santa Cruz",
                "state": "CA",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": null,
            "achievements": [],
            "hidden": false
        },
        {
            "id": 70578909780,
            "resource_state": 2,
            "name": "Eucalyptus-- Old Cabin to Twin Oaks",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 394,
            "moving_time": 352,
            "start_date": "2019-11-02T18:09:21Z",
            "start_date_local": "2019-11-02T11:09:21Z",
            "distance": 1268.9,
            "start_index": 496,
            "end_index": 586,
            "device_watts": false,
            "average_watts": 60.8,
            "segment": {
                "id": 719768,
                "resource_state": 2,
                "name": "Eucalyptus-- Old Cabin to Twin Oaks",
                "activity_type": "Ride",
                "distance": 1282.04,
                "average_grade": -3,
                "maximum_grade": 16,
                "elevation_high": 192,
                "elevation_low": 152.5,
                "start_latlng": [
                    36.990695,
                    -122.087957
                ],
                "end_latlng": [
                    36.988472,
                    -122.095621
                ],
                "start_latitude": 36.990695,
                "start_longitude": -122.087957,
                "end_latitude": 36.988472,
                "end_longitude": -122.095621,
                "climb_category": 0,
                "city": "Santa Cruz",
                "state": "CA",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": true
            },
            "kom_rank": null,
            "pr_rank": null,
            "achievements": [],
            "hidden": false
        },
        {
            "id": 70578909793,
            "resource_state": 2,
            "name": "Eucalyptus singletrack",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 373,
            "moving_time": 307,
            "start_date": "2019-11-02T18:10:30Z",
            "start_date_local": "2019-11-02T11:10:30Z",
            "distance": 928.5,
            "start_index": 523,
            "end_index": 593,
            "device_watts": false,
            "average_watts": 71.1,
            "segment": {
                "id": 713541,
                "resource_state": 2,
                "name": "Eucalyptus singletrack",
                "activity_type": "Ride",
                "distance": 857.68,
                "average_grade": -2.9,
                "maximum_grade": 9.7,
                "elevation_high": 200.6,
                "elevation_low": 173.6,
                "start_latlng": [
                    36.988117787986994,
                    -122.08951614797115
                ],
                "end_latlng": [
                    36.988380728289485,
                    -122.095848005265
                ],
                "start_latitude": 36.988117787986994,
                "start_longitude": -122.08951614797115,
                "end_latitude": 36.988380728289485,
                "end_longitude": -122.095848005265,
                "climb_category": 0,
                "city": "Santa Cruz",
                "state": "CA",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": null,
            "achievements": [],
            "hidden": false
        },
        {
            "id": 70578909823,
            "resource_state": 2,
            "name": "New Enchanted Climb",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 569,
            "moving_time": 552,
            "start_date": "2019-11-02T18:34:51Z",
            "start_date_local": "2019-11-02T11:34:51Z",
            "distance": 1150.3,
            "start_index": 712,
            "end_index": 805,
            "device_watts": false,
            "average_watts": 131.8,
            "segment": {
                "id": 11765763,
                "resource_state": 2,
                "name": "New Enchanted Climb",
                "activity_type": "Ride",
                "distance": 1194.5,
                "average_grade": 6,
                "maximum_grade": 32.2,
                "elevation_high": 172.6,
                "elevation_low": 99.3,
                "start_latlng": [
                    36.989909,
                    -122.10817
                ],
                "end_latlng": [
                    36.989694,
                    -122.10029
                ],
                "start_latitude": 36.989909,
                "start_longitude": -122.10817,
                "end_latitude": 36.989694,
                "end_longitude": -122.10029,
                "climb_category": 0,
                "city": "Santa Cruz",
                "state": "California",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": null,
            "achievements": [],
            "hidden": false
        },
        {
            "id": 70578909838,
            "resource_state": 2,
            "name": "Enchanted Loop connector",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 108,
            "moving_time": 108,
            "start_date": "2019-11-02T18:49:42Z",
            "start_date_local": "2019-11-02T11:49:42Z",
            "distance": 291.4,
            "start_index": 808,
            "end_index": 817,
            "device_watts": false,
            "average_watts": 108.2,
            "segment": {
                "id": 5734095,
                "resource_state": 2,
                "name": "Enchanted Loop connector",
                "activity_type": "Ride",
                "distance": 281.8,
                "average_grade": 1.8,
                "maximum_grade": 10.1,
                "elevation_high": 248.6,
                "elevation_low": 243.4,
                "start_latlng": [
                    36.989422,
                    -122.100393
                ],
                "end_latlng": [
                    36.988629,
                    -122.103173
                ],
                "start_latitude": 36.989422,
                "start_longitude": -122.100393,
                "end_latitude": 36.988629,
                "end_longitude": -122.103173,
                "climb_category": 0,
                "city": "Santa Cruz",
                "state": "CA",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": null,
            "achievements": [],
            "hidden": false
        },
        {
            "id": 70578909872,
            "resource_state": 2,
            "name": "Twin Oaks Trail",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 270,
            "moving_time": 270,
            "start_date": "2019-11-02T18:54:50Z",
            "start_date_local": "2019-11-02T11:54:50Z",
            "distance": 1103.8,
            "start_index": 838,
            "end_index": 909,
            "device_watts": false,
            "average_watts": 57.8,
            "segment": {
                "id": 616194,
                "resource_state": 2,
                "name": "Twin Oaks Trail",
                "activity_type": "Ride",
                "distance": 1006.99,
                "average_grade": -2.7,
                "maximum_grade": 17.1,
                "elevation_high": 193.6,
                "elevation_low": 160.2,
                "start_latlng": [
                    36.987963,
                    -122.100143
                ],
                "end_latlng": [
                    36.984134,
                    -122.092017
                ],
                "start_latitude": 36.987963,
                "start_longitude": -122.100143,
                "end_latitude": 36.984134,
                "end_longitude": -122.092017,
                "climb_category": 0,
                "city": "Santa Cruz",
                "state": "CA",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": 1,
            "achievements": [
                {
                    "type_id": 3,
                    "type": "pr",
                    "rank": 1
                }
            ],
            "hidden": false
        },
        {
            "id": 70578909853,
            "resource_state": 2,
            "name": "First Part of Twin Oaks",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 114,
            "moving_time": 114,
            "start_date": "2019-11-02T18:55:40Z",
            "start_date_local": "2019-11-02T11:55:40Z",
            "distance": 552.5,
            "start_index": 845,
            "end_index": 884,
            "device_watts": false,
            "average_watts": 24.5,
            "segment": {
                "id": 11380530,
                "resource_state": 2,
                "name": "First Part of Twin Oaks",
                "activity_type": "Ride",
                "distance": 551.2,
                "average_grade": -5.3,
                "maximum_grade": 3.6,
                "elevation_high": 190.9,
                "elevation_low": 161.5,
                "start_latlng": [
                    36.987711,
                    -122.098617
                ],
                "end_latlng": [
                    36.986516,
                    -122.094671
                ],
                "start_latitude": 36.987711,
                "start_longitude": -122.098617,
                "end_latitude": 36.986516,
                "end_longitude": -122.094671,
                "climb_category": 0,
                "city": "Santa Cruz",
                "state": "California",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": 3,
            "achievements": [
                {
                    "type_id": 3,
                    "type": "pr",
                    "rank": 3
                }
            ],
            "hidden": false
        },
        {
            "id": 70578909907,
            "resource_state": 2,
            "name": "Twin Oaks Downhill",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 251,
            "moving_time": 251,
            "start_date": "2019-11-02T18:57:53Z",
            "start_date_local": "2019-11-02T11:57:53Z",
            "distance": 1142.3,
            "start_index": 888,
            "end_index": 962,
            "device_watts": false,
            "average_watts": 94.5,
            "segment": {
                "id": 2172900,
                "resource_state": 2,
                "name": "Twin Oaks Downhill",
                "activity_type": "Ride",
                "distance": 1139.37,
                "average_grade": -2.3,
                "maximum_grade": 7.7,
                "elevation_high": 176.4,
                "elevation_low": 140.4,
                "start_latlng": [
                    36.986213168129325,
                    -122.0946581941098
                ],
                "end_latlng": [
                    36.97943405248225,
                    -122.08797647617757
                ],
                "start_latitude": 36.986213168129325,
                "start_longitude": -122.0946581941098,
                "end_latitude": 36.97943405248225,
                "end_longitude": -122.08797647617757,
                "climb_category": 0,
                "city": "Santa Cruz",
                "state": "CA",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": null,
            "achievements": [],
            "hidden": false
        },
        {
            "id": 70578909931,
            "resource_state": 2,
            "name": "Wilder Ridge Descent",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 343,
            "moving_time": 343,
            "start_date": "2019-11-02T19:06:15Z",
            "start_date_local": "2019-11-02T12:06:15Z",
            "distance": 2030.8,
            "start_index": 968,
            "end_index": 1090,
            "device_watts": false,
            "average_watts": 62.3,
            "segment": {
                "id": 5360391,
                "resource_state": 2,
                "name": "Wilder Ridge Descent",
                "activity_type": "Ride",
                "distance": 2028.2,
                "average_grade": -4.4,
                "maximum_grade": 12.9,
                "elevation_high": 132,
                "elevation_low": 39.9,
                "start_latlng": [
                    36.979468,
                    -122.08757
                ],
                "end_latlng": [
                    36.963509,
                    -122.086064
                ],
                "start_latitude": 36.979468,
                "start_longitude": -122.08757,
                "end_latitude": 36.963509,
                "end_longitude": -122.086064,
                "climb_category": 0,
                "city": "Santa Cruz",
                "state": "CA",
                "country": "United States",
                "private": false,
                "hazardous": false,
                "starred": false
            },
            "kom_rank": null,
            "pr_rank": null,
            "achievements": [],
            "hidden": false
        }
    ],
    "splits_metric": [
        {
            "distance": 1000.2,
            "elapsed_time": 342,
            "elevation_difference": -3,
            "moving_time": 334,
            "split": 1,
            "average_speed": 2.99,
            "pace_zone": 0
        },
        {
            "distance": 1042.8,
            "elapsed_time": 458,
            "elevation_difference": 60.8,
            "moving_time": 458,
            "split": 2,
            "average_speed": 2.28,
            "pace_zone": 0
        },
        {
            "distance": 992.6,
            "elapsed_time": 333,
            "elevation_difference": 34.6,
            "moving_time": 333,
            "split": 3,
            "average_speed": 2.98,
            "pace_zone": 0
        },
        {
            "distance": 975.1,
            "elapsed_time": 381,
            "elevation_difference": 43.8,
            "moving_time": 381,
            "split": 4,
            "average_speed": 2.56,
            "pace_zone": 0
        },
        {
            "distance": 994.8,
            "elapsed_time": 284,
            "elevation_difference": 9.4,
            "moving_time": 284,
            "split": 5,
            "average_speed": 3.5,
            "pace_zone": 0
        },
        {
            "distance": 995.4,
            "elapsed_time": 403,
            "elevation_difference": -10,
            "moving_time": 276,
            "split": 6,
            "average_speed": 3.61,
            "pace_zone": 0
        },
        {
            "distance": 1004.6,
            "elapsed_time": 847,
            "elevation_difference": -14.2,
            "moving_time": 389,
            "split": 7,
            "average_speed": 2.58,
            "pace_zone": 0
        },
        {
            "distance": 999.5,
            "elapsed_time": 1243,
            "elevation_difference": 46.4,
            "moving_time": 436,
            "split": 8,
            "average_speed": 2.29,
            "pace_zone": 0
        },
        {
            "distance": 1019.8,
            "elapsed_time": 337,
            "elevation_difference": -26.4,
            "moving_time": 295,
            "split": 9,
            "average_speed": 3.46,
            "pace_zone": 0
        },
        {
            "distance": 986.9,
            "elapsed_time": 583,
            "elevation_difference": -10,
            "moving_time": 291,
            "split": 10,
            "average_speed": 3.39,
            "pace_zone": 0
        },
        {
            "distance": 991.6,
            "elapsed_time": 601,
            "elevation_difference": -45.2,
            "moving_time": 278,
            "split": 11,
            "average_speed": 3.57,
            "pace_zone": 0
        },
        {
            "distance": 1005.2,
            "elapsed_time": 509,
            "elevation_difference": 62.6,
            "moving_time": 492,
            "split": 12,
            "average_speed": 2.04,
            "pace_zone": 0
        },
        {
            "distance": 1017.3,
            "elapsed_time": 759,
            "elevation_difference": 22.6,
            "moving_time": 396,
            "split": 13,
            "average_speed": 2.57,
            "pace_zone": 0
        },
        {
            "distance": 977.4,
            "elapsed_time": 212,
            "elevation_difference": -35.8,
            "moving_time": 203,
            "split": 14,
            "average_speed": 4.81,
            "pace_zone": 0
        },
        {
            "distance": 1001,
            "elapsed_time": 445,
            "elevation_difference": -60.6,
            "moving_time": 206,
            "split": 15,
            "average_speed": 4.86,
            "pace_zone": 0
        },
        {
            "distance": 1023.4,
            "elapsed_time": 184,
            "elevation_difference": -19.8,
            "moving_time": 184,
            "split": 16,
            "average_speed": 5.56,
            "pace_zone": 0
        },
        {
            "distance": 980.4,
            "elapsed_time": 208,
            "elevation_difference": -48.6,
            "moving_time": 159,
            "split": 17,
            "average_speed": 6.17,
            "pace_zone": 0
        },
        {
            "distance": 735.4,
            "elapsed_time": 350,
            "elevation_difference": 5.8,
            "moving_time": 310,
            "split": 18,
            "average_speed": 2.37,
            "pace_zone": 0
        }
    ],
    "splits_standard": [
        {
            "distance": 1613.6,
            "elapsed_time": 631,
            "elevation_difference": 38.6,
            "moving_time": 623,
            "split": 1,
            "average_speed": 2.59,
            "pace_zone": 0
        },
        {
            "distance": 1616.5,
            "elapsed_time": 575,
            "elevation_difference": 65.8,
            "moving_time": 575,
            "split": 2,
            "average_speed": 2.81,
            "pace_zone": 0
        },
        {
            "distance": 1655,
            "elapsed_time": 566,
            "elevation_difference": 45.6,
            "moving_time": 566,
            "split": 3,
            "average_speed": 2.92,
            "pace_zone": 0
        },
        {
            "distance": 1558.9,
            "elapsed_time": 1053,
            "elevation_difference": -16,
            "moving_time": 468,
            "split": 4,
            "average_speed": 3.33,
            "pace_zone": 0
        },
        {
            "distance": 1618.9,
            "elapsed_time": 1475,
            "elevation_difference": 29.4,
            "moving_time": 668,
            "split": 5,
            "average_speed": 2.42,
            "pace_zone": 0
        },
        {
            "distance": 1597.9,
            "elapsed_time": 847,
            "elevation_difference": -12.8,
            "moving_time": 513,
            "split": 6,
            "average_speed": 3.11,
            "pace_zone": 0
        },
        {
            "distance": 1610.8,
            "elapsed_time": 803,
            "elevation_difference": -49.8,
            "moving_time": 480,
            "split": 7,
            "average_speed": 3.36,
            "pace_zone": 0
        },
        {
            "distance": 1646.9,
            "elapsed_time": 1105,
            "elevation_difference": 75.8,
            "moving_time": 725,
            "split": 8,
            "average_speed": 2.27,
            "pace_zone": 0
        },
        {
            "distance": 1583.8,
            "elapsed_time": 330,
            "elevation_difference": -59.6,
            "moving_time": 321,
            "split": 9,
            "average_speed": 4.93,
            "pace_zone": 0
        },
        {
            "distance": 1651.7,
            "elapsed_time": 559,
            "elevation_difference": -62,
            "moving_time": 320,
            "split": 10,
            "average_speed": 5.16,
            "pace_zone": 0
        },
        {
            "distance": 1574.9,
            "elapsed_time": 527,
            "elevation_difference": -42.8,
            "moving_time": 438,
            "split": 11,
            "average_speed": 3.6,
            "pace_zone": 0
        },
        {
            "distance": 14.5,
            "elapsed_time": 8,
            "elevation_difference": 0.2,
            "moving_time": 8,
            "split": 12,
            "average_speed": 1.81,
            "pace_zone": 0
        }
    ],
    "laps": [
        {
            "id": 9316723241,
            "resource_state": 2,
            "name": "Lap 1",
            "activity": {
                "id": 2836726906,
                "resource_state": 1
            },
            "athlete": {
                "id": 2843574,
                "resource_state": 1
            },
            "elapsed_time": 8479,
            "moving_time": 5705,
            "start_date": "2019-11-02T16:58:21Z",
            "start_date_local": "2019-11-02T09:58:21Z",
            "distance": 17743.4,
            "start_index": 0,
            "end_index": 1141,
            "total_elevation_gain": 423,
            "average_speed": 2.09,
            "max_speed": 9.7,
            "device_watts": false,
            "average_watts": 97.5,
            "lap_index": 1,
            "split": 1
        }
    ],
    "gear": {
        "id": "b1803050",
        "primary": true,
        "name": "Solo",
        "resource_state": 2,
        "distance": 8670575
    },
    "photos": {
        "primary": null,
        "count": 0
    },
    "device_name": "Garmin Edge 520",
    "embed_token": "a5f412e5a5dd21776e3c640d1802d2b3a3b13358",
    "available_zones": []
}
*/

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

export interface StravaNativeDetailedActivity extends StravaNativeActivity {
  average_temp: string;
  average_watts: string;
  segment_efforts: StravaNativeSegmentEffort[];
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
