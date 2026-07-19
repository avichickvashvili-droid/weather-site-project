import { Request, Response } from 'express';
import { getWeather } from './weather.service';

export async function getWeatherHandler(req: Request, res: Response) {
  try {
    const weather = await getWeather();
    res.status(200).json({ weather });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `failed to fetch weather` });
  }
}
