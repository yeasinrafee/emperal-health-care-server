import express from 'express';
import { AppointmentController } from './appointment.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { AppointmentValidation } from './appointment.validation';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AppointmentController.getAllAppointment
);

router.get(
  '/my-appointment',
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointment
);

router.post(
  '/',
  auth(UserRole.PATIENT),
  validateRequest(AppointmentValidation.createAppointmentZodValidation),
  AppointmentController.createAppointment
);

export const AppointmentRoutes = router;
