import status from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Request, RequestHandler } from 'express';
import { DoctorScheduleService } from './doctorSchedule.service';
import { TAuthUser } from '../../types/common';

const createDoctorScheduleIntoDB: RequestHandler = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const data = req.body;
    const result = await DoctorScheduleService.createDoctorScheduleIntoDB(
      user,
      data
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Doctor Schedule created successfully!',
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  createDoctorScheduleIntoDB,
};
