import status from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { RequestHandler } from 'express';
import { DoctorScheduleService } from './doctorSchedule.service';

const createDoctorScheduleIntoDB: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await DoctorScheduleService.createDoctorScheduleIntoDB();
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
