import { Request, RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AppointmentService } from './appointment.service';
import sendResponse from '../../../shared/sendResponse';
import { TAuthUser } from '../../types/common';

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

export const AppointmentController = {
  createAppointment,
};
