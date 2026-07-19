//step is 86400 as it represents a day in date format as number E.G: date number is : 1720915200 the next day will be: 1720915200 + 86400
export const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

//return a string version of a readable date from timestamp, E.G: "date":"2026-07-15"
export function unixToDateString(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString().split('T')[0];
}
