import { PowerData } from "../type";

// https://medium.com/critical-powers/formulas-from-training-and-racing-with-a-power-meter-2a295c661b46
export function getPowerData(ftp: number, startIndex: number, endIndex: number, time: any[], watts: any[]): PowerData {

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