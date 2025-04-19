import { Request, RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PrescriptionService } from './prescription.service';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';
import { TAuthUser } from '../../types/common';
import pick from '../../../shared/pick';

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

// 2. Get My Prescriptions
const getMyPrescriptionsFromDB: RequestHandler = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await PrescriptionService.getMyPrescriptionsFromDB(
      user as TAuthUser,
      options
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Prescription retrieve successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const PrescriptionController = {
  createPrescriptionIntoDB,
  getMyPrescriptionsFromDB,
};
