import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFoundErrorHandler from './app/middlewares/notFoundErrorHandler';
import cookieParser from 'cookie-parser';
import { AppointmentService } from './app/modules/Appointment/appointment.service';
import cron from 'node-cron';

const app: Application = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1', router);

app.use(notFoundErrorHandler);
app.use(globalErrorHandler);

cron.schedule('* * * * *', () => {
  try {
    AppointmentService.cancelUnpaidAppointments();
  } catch (error) {
    console.error(error);
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send({
    Message: 'Emperal Health Care Running.',
  });
});

export default app;
