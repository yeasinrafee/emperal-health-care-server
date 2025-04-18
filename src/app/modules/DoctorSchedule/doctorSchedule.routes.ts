import express from 'express';
import { DoctorScheduleController } from './doctorSchedule.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/my-schedule',
  auth(UserRole.DOCTOR),
  DoctorScheduleController.getMyScheduleFromDB
);

router.post(
  '/',
  auth(UserRole.DOCTOR),
  DoctorScheduleController.createDoctorScheduleIntoDB
);

export const DoctorScheduleRoutes = router;
