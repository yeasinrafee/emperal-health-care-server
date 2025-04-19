import { Request, RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ReviewService } from './review.service';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';
import { TAuthUser } from '../../types/common';

// 1. Create Review
const createReviewIntoDB: RequestHandler = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const data = req.body;

    const result = await ReviewService.createReviewIntoDB(
      user as TAuthUser,
      data
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Review created successfully!',
      data: result,
    });
  }
);

export const ReviewController = {
  createReviewIntoDB,
};
