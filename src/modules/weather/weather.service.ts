import * as utils from '../../utils/utils';
import { Day, Forecast } from './weather.types';
import { getWeatherDetails, WeatherDetails } from '../../utils/wmo-weather';
import { fetchWeatherApi } from 'openmeteo';
import { weatherParams, weatherApiUrl } from '../../config/weather.config';

export async function getWeather(): Promise<Forecast> {
  const weatherApiResponse = await fetchWeatherApi(
    weatherApiUrl,
    weatherParams,
  );

  const response = weatherApiResponse[0];

  const utcOffsetSeconds = response.utcOffsetSeconds();

  const current = response.current()!;
  const daily = response.daily()!;
  console.log(daily.interval());
  const weatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature: current.variables(0)!.value(), // Current is only 1 value, therefore `.value()`
      weatherCode: current.variables(1)!.value(),
      windSpeed: current.variables(2)!.value(),
      windDirection: current.variables(3)!.value(),
    },
    daily: {
      time: utils.range(
        Number(daily.time()),
        Number(daily.timeEnd()),
        daily.interval(),
      ),
      weatherCode: daily.variables(0)!.valuesArray()!,
      temperatureMax: daily.variables(1)!.valuesArray()!,
      temperatureMin: daily.variables(2)!.valuesArray()!,
    },
  };
  const forecast: Forecast = [];
  for (let i = 0; i < weatherData.daily.time.length; i++) {
    const day = buildDay(
      utils.unixToDateString(weatherData.daily.time[i]),
      weatherData.daily.weatherCode[i],
      getWeatherDetails(weatherData.daily.weatherCode[i]),
      weatherData.daily.temperatureMax[i],
      weatherData.daily.temperatureMin[i],
    );
    forecast.push(day);
  }

  return forecast;
}

export function buildDay(
  date: string,
  apiResponseCode: number,
  todayWeather: WeatherDetails,
  tempMax: number,
  tempMin: number,
): Day {
  const { description, group } = todayWeather;
  const day: Day = {
    date: date,
    weatherCode: apiResponseCode,
    description: description,
    group: group,
    tempMax: tempMax,
    tempMin: tempMin,
  };
  return day;
}
