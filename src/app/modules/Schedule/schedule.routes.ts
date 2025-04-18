import express from 'express';
import { ScheduleController } from './schedule.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', auth(UserRole.DOCTOR), ScheduleController.getAllScheduleFromDB);
router.get(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleController.getSingleSchedule
);

router.post(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ScheduleController.createScheduleIntoDB
);

export const ScheduleRoutes = router;
