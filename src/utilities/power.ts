export function getPowerData(time: any[], watts: any[]): any {

  // for now, assume that the nth entry in watts represent the power reading at n seconds
  // if that turns out not to be true, use the values in time

  const np = getNormalizedPower(watts);
}

function getNormalizedPower(watts: any[]): number {

  // Step 1: Calculate the rolling average with a window of 30 seconds: Start at 30 seconds, 
  // calculate the average power of the previous 30 seconds and to the for every second after that.
  const rollingAverages: number[] = getRollingAverages(watts, 30);

  // Step 2: Calculate the 4th power of the values from the previous step.
  const fourthPowers: number[] = getNthPowers(rollingAverages, 4);

  // Step 3: Calculate the average of the values from the previous step.
  const average = getAverage(fourthPowers);

  // Step 4: Take the fourth root of the average from the previous step. This is your normalized power.
  const np = Math.pow(average, 0.25);

  console.log('Normalized power: ', np);

  return np;
}

function getRollingAverages(values: number[], windowCount: number): number[] {

  const rollingAverages: number[] = [];

  const numRollingAverages = values.length - windowCount + 1;

  let startIndex = 0;

  while (startIndex < numRollingAverages) {
    const rollingAverage = getRollingAverage(values, startIndex, windowCount);
    rollingAverages.push(rollingAverage);
    startIndex++;
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
