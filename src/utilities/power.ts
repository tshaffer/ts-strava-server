import { PowerData } from '../type';
import * as fs from 'fs';
import * as path from 'path';

export function getMmpData(watts: number[]) {

  const maxPowerAtDurations: number[] = [];

  const numSamples = watts.length;

  // let loopCounter = 0;

  let duration = 5;
  while (duration < numSamples) {

    // the average powers for this duration for instances of this duration in the ride
    const averagePowersAtDuration: number[] = getRollingAverages(watts, 0, numSamples - 1, duration);

    // get maximum average power in this ride at this duration
    let indexOfMaximumValueForDuration = 0;
    const maxAveragePowerAtDuration = averagePowersAtDuration.reduce((accumulator, currentValue, currentIndex) => {
        if (currentValue > accumulator) {
          indexOfMaximumValueForDuration = currentIndex;
        }
      return Math.max(accumulator, currentValue);
    });
    maxPowerAtDurations.push(maxAveragePowerAtDuration);

    // if (loopCounter === 0) {
    //   console.log('Maximum power for a ' + duration + ' second effort is ' + maxAveragePowerAtDuration + ' watts, starting at an elapsed time of ' + indexOfMaximumValueForDuration.toString() + ' seconds');
    // }
    // loopCounter++;
    // if (loopCounter >= 20) {
    //   loopCounter = 0;
    // }

    duration++;
  }

  // const mmpDataPath = path.join(__dirname, '../../data/mmpData.csv');
  // const mmpDataStream = fs.createWriteStream(mmpDataPath);
  // console.log('begin write');
  // maxPowerAtDurations.forEach((maxPowerAtDuration, index) => {
  //   mmpDataStream.write((index + 5).toString + ',' + maxPowerAtDuration.toString() + '\n');
  // });
  // mmpDataStream.end();
  // console.log('write complete');
}

// https://medium.com/critical-powers/formulas-from-training-and-racing-with-a-power-meter-2a295c661b46
export function getPowerData(ftp: number, startIndex: number, endIndex: number, time: any[], watts: any[]): PowerData {

  // using a 30 second window - if there are fewer than that number of values, return 0's
  if (endIndex - startIndex < 30) {
    return {
      normalizedPower: 0,
      intensityFactor: 0,
      trainingStressScore: 0,
    };
  }
  // for now, assume that the nth entry in watts represents the power reading at n seconds
  // if that turns out not to be true, use the values in time
  // that is, assume that time.length is duration of workout in seconds

  const np = getNormalizedPower(startIndex, endIndex, watts);
  const intensityFactor = getIntensityFactor(ftp, np);
  const trainingStressScore = getTrainingStressScore(ftp, np, intensityFactor, time.length);

  const powerData: PowerData = {
    normalizedPower: np,
    intensityFactor,
    trainingStressScore,
  };
  console.log('power data:');
  console.log(powerData);

  return powerData;
}

function getNormalizedPower(startIndex: number, endIndex: number, watts: any[]): number {

  // Step 1: Calculate the rolling average with a window of 30 seconds: Start at 30 seconds, 
  // calculate the average power of the previous 30 seconds and to the for every second after that.
  const rollingAverages: number[] = getRollingAverages(watts, startIndex, endIndex, 30);

  // Step 2: Calculate the 4th power of the values from the previous step.
  const fourthPowers: number[] = getNthPowers(rollingAverages, 4);

  // Step 3: Calculate the average of the values from the previous step.
  const average = getAverage(fourthPowers);

  // Step 4: Take the fourth root of the average from the previous step. This is your normalized power.
  const np = Math.pow(average, 0.25);

  return np;
}

function getIntensityFactor(ftp: number, np: number): number {
  return np / ftp;
}

function getTrainingStressScore(ftp: number, np: number, intensityFactor: number, numSeconds: number): number {
  const tss = (numSeconds * np * intensityFactor) / (ftp * 36);
  return tss;
}

function getRollingAverages(values: number[], startIndex: number, endIndex: number, windowLength: number): number[] {

  const rollingAverages: number[] = [];

  let rollingAverageCount = 0;
  const numRollingAverages = (endIndex - startIndex + 1) - windowLength + 1;

  while (rollingAverageCount < numRollingAverages) {
    const rollingAverage = getRollingAverage(values, startIndex, windowLength);
    rollingAverages.push(rollingAverage);
    startIndex++;
    rollingAverageCount++;
  }

  return rollingAverages;
}

function getRollingAverage(values: number[], startIndex: number, count: number): number {
  let sum = 0;
  for (let i = startIndex; i < (startIndex + count); i = i + 1) {
    sum += values[i];
  }
  return sum / count;
}

function getNthPowers(values: number[], n: number): number[] {
  const powers: number[] = [];
  for (const value of values) {
    powers.push(Math.pow(value, n));
  }
  return powers;
}

function getAverage(nums: number[]): number {
  return nums.reduce((a, b) => (a + b)) / nums.length;
}
