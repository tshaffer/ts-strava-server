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

      // for afterDate, strava only seems to look at the date; that is, it doesn't look at the time
      // therefore, jump to the next day - the result is that it's possible to lose an activity that occurs on
      // the same date if the activities happen to fall on a page boundary
      // const afterDate = new Date(dateOfLastFetchedActivity);
      const afterDate = new Date('November 1, 2019 00:00:00');
      afterDate.setDate(afterDate.getDate() + 1); // given how strava treats 'afterDate', the following shouldn't make any difference, but ....
      afterDate.setHours(0);
      afterDate.setMinutes(0);
      afterDate.setSeconds(0);
      afterDate.setMilliseconds(0);

      let secondsSinceEpochOfLastActivity = Math.floor(afterDate.getTime() / 1000);
      if (secondsSinceEpochOfLastActivity < 0) {
        secondsSinceEpochOfLastActivity = 0;
      }

      console.log('seconds since...');
      console.log(secondsSinceEpochOfLastActivity);

      fetchSummaryActivities(accessToken, secondsSinceEpochOfLastActivity)
        .then((summaryActivities: any[]) => {
          response.json(summaryActivities);
        });
    })
    .catch((err: Error) => {
      console.log('accessToken error: ', err);
    });
}

