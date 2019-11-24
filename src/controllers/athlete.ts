import { Request, Response } from 'express';

import {
  Athlete,
} from '../type';

export function getAthletes(request: Request, response: Response) {
  
  console.log('getAthletes');

  const athletes: Athlete[] = [
    {
      id: '2843574',
      nickname: 'Dad',
      firstName: 'Ted',
      lastName: 'Shaffer',
      email: 'shaffer.family@gmail.com',
    },
    {
      id: '7085811',
      nickname: 'Mom',
      firstName: 'Lori',
      lastName: 'Shaffer',
      email: 'loriashaffer@gmail.com',
    },
  ];

  response.json(athletes);
}
