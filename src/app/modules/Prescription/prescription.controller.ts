import { Request, RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PrescriptionService } from './prescription.service';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';
import { TAuthUser } from '../../types/common';

// 1. Create Prescription
const createPrescriptionIntoDB: RequestHandler = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const data = req.body;
    const result = await PrescriptionService.createPrescriptionIntoDB(
      user as TAuthUser,
      data
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Prescription created successfully!',
      data: result,
    });
  }
);

export const PrescriptionController = {
  createPrescriptionIntoDB,
};
