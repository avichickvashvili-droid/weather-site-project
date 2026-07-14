import express, { Request, Response } from 'express';
import { fetchWeatherApi } from 'openmeteo';
import { weatherParams } from './config/weather.config';
import * as utils from './utils/utils';
import { getWeatherDetails } from './utils/wmo-weather';

const url = 'https://api.open-meteo.com/v1/forecast';

const app = express();
const Port = 3000;

//localhost:3000/api/weather
//localhost:3000/
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
  try {
    utils.multiply(5, 6);
    const apiresponse = await fetchWeatherApi(url, weatherParams);
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
        time: utils.range(
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
