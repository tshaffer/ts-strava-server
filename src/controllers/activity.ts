import { Request, Response } from 'express';

import { fetchSummaryActivities, retrieveAccessToken } from '../controllers';

export function getActivities(request: Request, response: Response) {
  console.log('getActivities');
  return retrieveAccessToken()
    .then((accessToken: any) => {
      console.log('accessToken');
      console.log(accessToken);
  /*
    seconds calculation
    seconds per minute: 60
    minutes per hour: 60
    hours per day: 24
    days per week: 7
    seconds in last week: 7 * 24 * 60 * 60 = 604800
  */
      fetchSummaryActivities(accessToken, '604800')
        .then( (summaryActivities: any[]) => {
          response.json({
            summaryActivities,
          });
        });
      // response.json(accessToken);
    })
    .catch((err: Error) => {
      console.log('accessToken error: ', err);
    });
}

