import express, { Request, Response } from 'express';
import weatherRoutes from './modules/weather/weather.routes';

const app = express();
const Port = 3000;

app.use(express.json());

app.use('/api/weather', weatherRoutes);

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
