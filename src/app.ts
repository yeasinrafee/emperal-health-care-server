import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send({
    Message: 'Emperal Health Care Running.',
  });
});

export default app;
