import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFoundErrorHandler from './app/middlewares/notFoundErronHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

app.use(globalErrorHandler);
app.use(notFoundErrorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send({
    Message: 'Emperal Health Care Running.',
  });
});

export default app;
