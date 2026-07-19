export type Forecast = Day[];

export type Day = {
  date: string;
  weatherCode: number;
  description: string;
  group: string;
  tempMax: number;
  tempMin: number;
};
