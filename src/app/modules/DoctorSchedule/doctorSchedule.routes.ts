import express from 'express';
import { DoctorScheduleController } from './doctorSchedule.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.DOCTOR),
  DoctorScheduleController.getAllScheduleFromDB
);

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

router.delete(
  '/:id',
  auth(UserRole.DOCTOR),
  DoctorScheduleController.deleteMyScheduleFromDB
);

export const DoctorScheduleRoutes = router;
