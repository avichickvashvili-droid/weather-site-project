/*import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
*/

import express, { Request, Response } from 'express';
const app = express();
const Port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'simple avi',
  });
});

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
