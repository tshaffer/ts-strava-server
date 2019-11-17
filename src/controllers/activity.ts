import { Request, Response } from 'express';
import axios from 'axios';

let globalAccessToken: any;

export function getActivities(request: Request, response: Response) {
  console.log('getActivities');
  return retrieveAccessToken()
    .then((accessToken: any) => {
      console.log('accessToken');
      console.log(accessToken);
      response.json(accessToken);
    })
    .catch((err: Error) => {
      console.log('accessToken error: ', err);
    });
}

function retrieveAccessToken() {

  const serverUrl = 'https://www.strava.com/';
  const apiPrefix = 'api/v3/';
  const endPoint = 'oauth/token';
  const path = serverUrl + apiPrefix + endPoint;

  // -d "client_id=2055" -d "client_secret=85f821429c9da1ef02b627058119a4253eafd16d" -d "grant_type=refresh_token" -d "refresh_token=ca65f7aff433b44f351ff04ce0b33085bb0a0ed6" 

  console.log('axios post');
  console.log('path: ', path);

  return axios.post(path,
    {
      client_id: 2055,
      client_secret: '85f821429c9da1ef02b627058119a4253eafd16d',
      grant_type: 'refresh_token',
      refresh_token: 'ca65f7aff433b44f351ff04ce0b33085bb0a0ed6',
    })
    .then((response: any) => {
      console.log('response to axios post: ');
      console.log(response);
      globalAccessToken = response.data.access_token;
      return Promise.resolve(response.data.access_token);
    }).catch((err: Error) => {
      console.log('response to axios post: ');
      console.log('err: ', err);
      return Promise.reject(err);
    });
}
