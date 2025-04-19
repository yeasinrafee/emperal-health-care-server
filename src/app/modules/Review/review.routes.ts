import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { ReviewController } from './review.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';

const router = express.Router();

router.get('/', ReviewController.getAllReviewsFromDB);

router.post(
  '/',
  auth(UserRole.PATIENT),
  validateRequest(ReviewValidation.createReviewZodValidation),
  ReviewController.createReviewIntoDB
);

export const ReviewRoutes = router;
