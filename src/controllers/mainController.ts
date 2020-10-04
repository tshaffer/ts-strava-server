import { Request, Response } from 'express';
import * as path from 'path';

export function getIndex(request: Request, response: Response) {
  const pathToIndex = path.join(__dirname, '../../public', 'index.html');
  response.sendFile(pathToIndex);
}

export function getCSS(request: Request, response: Response) {
  const pathToCSS = path.join(__dirname, '../../public', 'css', 'app.css');
  response.sendFile(pathToCSS);
}

export function getBundle(request: Request, response: Response) {
  const pathToBundle = path.join(__dirname, '../../public', 'build', 'bundle.js');
  response.sendFile(pathToBundle);
}

export function getBundleMap(request: Request, response: Response) {
  const pathToBundleMap = path.join(__dirname, '../../public', 'build', 'bundle.js.map');
  response.sendFile(pathToBundleMap);
}
