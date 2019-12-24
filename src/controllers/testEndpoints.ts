import { Request, Response } from 'express';
import { StravatronStream, StravatronActivityStreams } from '../type';

import Activity from '../models/Activity';
import Segment from '../models/Segment';
import SegmentEffort from '../models/SegmentEffort';
import ActivityStreams from '../models/ActivityStreams';
import { retrieveAccessToken, fetchStreams, fetchSegment, fetchSegmentEffort } from './strava';
import { getStreamData } from './activity';

export function getStravaSegment(request: Request, response: Response, next: any) {

  const segmentId: number = Number(request.params.id);

  retrieveAccessToken()
    .then((accessToken: any) => {
      return fetchSegment(accessToken, segmentId)
        .then((segment) => {
          response.status(200).json({
            success: true,
            data: segment,
          });
        });
    });
}

export function getStravaSegmentEffort(request: Request, response: Response, next: any) {
  
  const segmentEffortId: number = Number(request.params.id);

  retrieveAccessToken()
    .then((accessToken: any) => {
      return fetchSegmentEffort(accessToken, segmentEffortId)
        .then((segmentEffort) => {
          response.status(200).json({
            success: true,
            data: segmentEffort,
          });
        });
    });

}

export function createActivity(request: Request, response: Response, next: any) {
  console.log('createActivity');
  console.log(request.body);
  Activity.create(request.body).then((activity: any) => {
    response.status(201).json({
      success: true,
      data: activity,
    });
  });
}

export function createSegment(request: Request, response: Response, next: any) {
  console.log('createSegment');
  console.log(request.body);
  Segment.create(request.body).then((segment: any) => {
    response.status(201).json({
      success: true,
      data: segment,
    });
  });
}

export function createSegmentEffort(request: Request, response: Response, next: any) {
  console.log('createSegmentEffort');
  console.log(request.body);
  SegmentEffort.create(request.body).then((segmentEffort: any) => {
    response.status(201).json({
      success: true,
      data: segmentEffort,
    });
  });
}

export function createStream(request: Request, response: Response, next: any) {
  console.log('createStream');
  // console.log(request.body);
  const bodySize = roughSizeOfObject(request.body);
  console.log('bodySize: ' + bodySize);
  ActivityStreams.create(request.body).then((activityStreams: any) => {
    response.status(201).json({
      success: true,
      data: activityStreams,
    });
  });
}

export function getStreams(request: Request, response: Response): Promise<any> {

  const activityId: string = request.params.id;

  let accessToken: any;

  return retrieveAccessToken()

    .then((accessTokenRet: any) => {

      accessToken = accessTokenRet;
      return fetchStreams(accessToken, activityId);

    }).then((streams: StravatronStream[]) => {

      const stravatronStreamData: StravatronActivityStreams = getStreamData(Number(activityId), streams);
      console.log(stravatronStreamData);

      return response.status(201).json({
        success: true,
        data: stravatronStreamData,
      });

    });
}

function roughSizeOfObject(object: any): number {

  const objectList = [];
  const stack = [object];
  let bytes = 0;

  while (stack.length) {
    const value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;
    }
    else if (typeof value === 'string') {
      bytes += value.length * 2;
    }
    else if (typeof value === 'number') {
      bytes += 8;
    }
    else if
      (
      typeof value === 'object'
      && objectList.indexOf(value) === -1
    ) {
      objectList.push(value);

      for (const i in value) {
        if (value[i]) {
          stack.push(value[i]);
        }
      }
    }
  }
  return bytes;
}
