import { TAuthUser } from './../../types/common';
import status from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Request, RequestHandler } from 'express';
import { DoctorScheduleService } from './doctorSchedule.service';
import pick from '../../../shared/pick';

// 1. Create Doctor Schedule
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

// 2. Get My Schedules
const getMyScheduleFromDB: RequestHandler = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const user = req.user;
    const result = await DoctorScheduleService.getMySchedulesFromDB(
      filters,
      options,
      user as TAuthUser
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'My schedules are retrieved successfully',
      data: result,
    });
  }
);

// 2. Delete my Schedule
const deleteMyScheduleFromDB: RequestHandler = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await DoctorScheduleService.deleteMySchedule(
      user as TAuthUser,
      id
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'My schedule is deleted successfully',
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  createDoctorScheduleIntoDB,
  getMyScheduleFromDB,
  deleteMyScheduleFromDB,
};
