import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';
import { ScheduleService } from './schedule.service';

// 1. Create Schedule
const createScheduleIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await ScheduleService.createScheduleIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Schedule created successfully',
    data: result,
  });
});

// 2. Get All Schedule
const getAllScheduleFromDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await ScheduleService.getAllSchedulesFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Schedules are retrieved successfully',
    data: result,
  });
});

export const ScheduleController = {
  createScheduleIntoDB,
  getAllScheduleFromDB,
};
