import express, { Request, Response } from 'express';
import { fetchWeatherApi } from 'openmeteo';

const params = {
  latitude: [31.2518],
  longitude: [34.7913],
  current: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m',
  //hourly: 'temperature_2m',
  daily: 'weather_code,temperature_2m_max,temperature_2m_min',
  forecast_days: 14,
};

const url = 'https://api.open-meteo.com/v1/forecast';

const range = (
  start: number,
  stop: number,
  step: number,
  p0: (t: any) => Date,
) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

const app = express();
const Port = 3000;

app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
  try {
    const apiresponse = await fetchWeatherApi(url, params);
    const response = apiresponse[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    //const timezone = response.timezone();
    //const timezoneAbbreviation = response.timezoneAbbreviation();
    //const latitude = response.latitude();
    //const longitude = response.longitude();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;
    const weatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature: current.variables(0)!.value(), // Current is only 1 value, therefore `.value()`
        weatherCode: current.variables(1)!.value(),
        windSpeed: current.variables(2)!.value(),
        windDirection: current.variables(3)!.value(),
      },
      /*hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval(),
          (t) => new Date((t + utcOffsetSeconds) * 1000),
        ),
        temperature: hourly.variables(0)!.valuesArray()!, // `.valuesArray()` get an array of 
        precipitation: hourly.variables(1)!.valuesArray()!,
      },*/
      daily: {
        time: range(
          Number(daily.time()),
          Number(daily.timeEnd()),
          daily.interval(),
          (t) => new Date((t + utcOffsetSeconds) * 1000),
        ),
        weatherCode: daily.variables(0)!.valuesArray()!,
        temperatureMax: daily.variables(1)!.valuesArray()!,
        temperatureMin: daily.variables(2)!.valuesArray()!,
      },
    };

    const forecast: {
      date: string;
      weatherCode: number;
      description: string;
      group: string;
      tempMax: number;
      tempMin: number;
    }[] = [];

    for (let i = 0; i < weatherData.daily.time.length; i++) {
      const timestamp: number = weatherData.daily.time[i];
      const date = new Date(timestamp * 1000).toISOString().split('T')[0];

      const apiResponseCode = weatherData.daily.weatherCode[i];
      const todayWeather = getWeatherDetails(apiResponseCode);

      const day = {
        date,
        weatherCode: apiResponseCode,
        description: todayWeather.description,
        group: todayWeather.group,
        tempMax: weatherData.daily.temperatureMax[i],
        tempMin: weatherData.daily.temperatureMin[i],
      };

      forecast.push(day);
    }

    res.status(200).json({
      current: weatherData.current,
      forecast,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `failed to fetch weather` });
  }
});

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});

export type WmoWeatherCode =
  | 0
  | 1
  | 2
  | 3
  | 45
  | 48
  | 51
  | 53
  | 55
  | 56
  | 57
  | 61
  | 63
  | 65
  | 66
  | 67
  | 71
  | 73
  | 75
  | 77
  | 80
  | 81
  | 82
  | 85
  | 86
  | 95
  | 96
  | 99;

export interface WeatherDetails {
  readonly description: string;
  readonly group: string; // Helpful for UI styling or choosing icons
}

export const WMO_WEATHER_LOOKUP = new Map<WmoWeatherCode, WeatherDetails>([
  [0, { description: 'Clear sky', group: 'Clear' }],
  [1, { description: 'Mainly clear', group: 'Cloudy' }],
  [2, { description: 'Partly cloudy', group: 'Cloudy' }],
  [3, { description: 'Overcast', group: 'Cloudy' }],
  [45, { description: 'Fog', group: 'Fog' }],
  [48, { description: 'Depositing rime fog', group: 'Fog' }],
  [51, { description: 'Drizzle: Light intensity', group: 'Drizzle' }],
  [53, { description: 'Drizzle: Moderate intensity', group: 'Drizzle' }],
  [55, { description: 'Drizzle: Dense intensity', group: 'Drizzle' }],
  [
    56,
    {
      description: 'Freezing Drizzle: Light intensity',
      group: 'Freezing Rain',
    },
  ],
  [
    57,
    {
      description: 'Freezing Drizzle: Dense intensity',
      group: 'Freezing Rain',
    },
  ],
  [61, { description: 'Rain: Slight intensity', group: 'Rain' }],
  [63, { description: 'Rain: Moderate intensity', group: 'Rain' }],
  [65, { description: 'Rain: Heavy intensity', group: 'Rain' }],
  [
    66,
    { description: 'Freezing Rain: Light intensity', group: 'Freezing Rain' },
  ],
  [
    67,
    { description: 'Freezing Rain: Heavy intensity', group: 'Freezing Rain' },
  ],
  [71, { description: 'Snow fall: Slight intensity', group: 'Snow' }],
  [73, { description: 'Snow fall: Moderate intensity', group: 'Snow' }],
  [75, { description: 'Snow fall: Heavy intensity', group: 'Snow' }],
  [77, { description: 'Snow grains', group: 'Snow' }],
  [80, { description: 'Rain showers: Slight', group: 'Rain Showers' }],
  [81, { description: 'Rain showers: Moderate', group: 'Rain Showers' }],
  [82, { description: 'Rain showers: Violent', group: 'Rain Showers' }],
  [85, { description: 'Snow showers: Slight', group: 'Snow Showers' }],
  [86, { description: 'Snow showers: Heavy', group: 'Snow Showers' }],
  [
    95,
    { description: 'Thunderstorm: Slight or moderate', group: 'Thunderstorm' },
  ],
  [96, { description: 'Thunderstorm with slight hail', group: 'Thunderstorm' }],
  [99, { description: 'Thunderstorm with heavy hail', group: 'Thunderstorm' }],
]);

export function getWeatherDetails(code: number): WeatherDetails {
  // Check if the generic number is a valid code in our Map
  if (WMO_WEATHER_LOOKUP.has(code as WmoWeatherCode)) {
    return WMO_WEATHER_LOOKUP.get(code as WmoWeatherCode)!;
  }

  return {
    description: `Unknown Weather (Code ${code})`,
    group: 'Unknown',
  };
}
