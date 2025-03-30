import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../../helpers/fileUploader';
import { userValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-admin',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdminZodValidation.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createAdmin(req, res, next);
  }
);

router.post(
  '/create-doctor',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctorZodValidation.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createDoctor(req, res, next);
  }
);

export const UserRoutes = router;
