import { Request, RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AppointmentService } from './appointment.service';
import sendResponse from '../../../shared/sendResponse';
import { TAuthUser } from '../../types/common';
import pick from '../../../shared/pick';

// 1. Create an Appointment
const createAppointment: RequestHandler = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const data = req.body;
    const result = await AppointmentService.createAppointment(
      user as TAuthUser,
      data
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Appointment created successfully',
      data: result,
    });
  }
);

// 2. Get All Appointment
const getAllAppointment: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['status', 'paymentStatus']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await AppointmentService.getAllAppointment(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Appointments are retrieved successfully',
    data: result,
  });
});

// 3. Get My Appointment
const getMyAppointment: RequestHandler = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const filters = pick(req.query, ['status', 'paymentStatus']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await AppointmentService.getMyAppointment(
      user as TAuthUser,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'My appointments are retrieved successfully',
      data: result,
    });
  }
);

// 4. Change Appointment Status
const changeAppointmentStatus: RequestHandler = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;
    const result = await AppointmentService.changeAppointmentStatus(
      id,
      status,
      user as TAuthUser
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Appointments status changed successfully',
      data: result,
    });
  }
);

export const AppointmentController = {
  createAppointment,
  getAllAppointment,
  getMyAppointment,
  changeAppointmentStatus,
};
