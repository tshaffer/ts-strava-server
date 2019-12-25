import * as fs from 'fs';
import * as path from 'path';
import { Request, Response } from 'express';
import ZwiftSegment from '../models/ZwiftSegment';

export function insertZwiftSegments(request: Request, response: Response, next: any) {

  const zwiftSegmentsPath = path.join(__dirname, '../../data/zwiftSegments.json');
  const rawData = fs.readFileSync(zwiftSegmentsPath);
  const zwiftSegments = JSON.parse(rawData.toString());

  ZwiftSegment.collection.insertMany(
    zwiftSegments.zwiftSegment,
    {
      ordered: false,
    },
  ).then(() => {
    response.sendStatus(200);
  });
}

