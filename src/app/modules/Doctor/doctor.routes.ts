import express from 'express';
import { DoctorController } from './doctor.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  DoctorController.getAllDoctorsFromDB
);

router.patch('/:id', DoctorController.updateDoctorIntoDB);

export const DoctorRouters = router;
