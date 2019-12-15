import { Request, Response } from 'express';

import SummaryActivity from '../models/SummaryActivity';

export function createSummaryActivity(request: Request, response: Response, next: any) {
  console.log(createSummaryActivity);
  console.log(request.body);
  SummaryActivity.create(request.body).then( (summaryActivity: any) => {
    response.status(201).json({
      success: true,
      data: summaryActivity,
    });
  });
  
  // response.status(200).json({ success: true, data: null });
}
