import { Request, RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ReviewService } from './review.service';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';
import { TAuthUser } from '../../types/common';
import pick from '../../../shared/pick';
import { reviewFilterableFields } from './review.constant';

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

// 2. Get All Reviews
const getAllReviewsFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ReviewService.getAllReviewsFromDB(filters, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Reviews are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const ReviewController = {
  createReviewIntoDB,
  getAllReviewsFromDB,
};
