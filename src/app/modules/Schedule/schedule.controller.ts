import { Request, RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';
import { ScheduleService } from './schedule.service';
import pick from '../../../shared/pick';
import { TAuthUser } from '../../types/common';

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
const getAllScheduleFromDB: RequestHandler = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const filters = pick(req.query, ['startDate', 'endDate']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const user = req.user;
    const result = await ScheduleService.getAllSchedulesFromDB(
      filters,
      options,
      user as TAuthUser
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Schedules are retrieved successfully',
      data: result,
    });
  }
);

// 3. Get Single Schedule
const getSingleSchedule: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ScheduleService.getSingleSchedule(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Schedules is retrieved successfully',
    data: result,
  });
});

// 4. Delete Schedule
const deleteScheduleFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ScheduleService.deleteScheduleFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Schedules is deleted successfully',
    data: result,
  });
});

export const ScheduleController = {
  createScheduleIntoDB,
  getAllScheduleFromDB,
  getSingleSchedule,
  deleteScheduleFromDB,
};
