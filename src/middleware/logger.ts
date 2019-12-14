import { Request, Response } from 'express';

const logger = (request: Request, response: Response, next: any) => {
  console.log(`${request.method} ${request.protocol}://${request.get('host')}${request.originalUrl}`);
  next();
};

export default logger;
