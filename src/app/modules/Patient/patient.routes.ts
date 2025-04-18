import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { PatientController } from './patient.controller';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  PatientController.getAllPatientFromDB
);

router.get(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  PatientController.getSinglePatientFromDB
);

router.patch(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PATIENT),
  PatientController.updatePatientInDB
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PATIENT),
  PatientController.deletePatientFromDB
);

router.delete(
  '/soft/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PATIENT),
  PatientController.softDeletePatientFromDB
);

export const PatientRoutes = router;
