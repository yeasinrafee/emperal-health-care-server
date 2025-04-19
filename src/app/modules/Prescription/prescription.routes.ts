import express from 'express';
import auth from '../../middlewares/auth';
import { PrescriptionController } from './prescription.controller';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PrescriptionController.getAllPrescriptionsFromDB
);

router.get(
  '/my-prescriptions',
  auth(UserRole.PATIENT),
  PrescriptionController.getMyPrescriptionsFromDB
);

router.post(
  '/',
  auth(UserRole.DOCTOR),
  PrescriptionController.createPrescriptionIntoDB
);

export const PrescriptionRoutes = router;
