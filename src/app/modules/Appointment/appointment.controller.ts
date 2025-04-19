import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AppointmentService } from './appointment.service';
import sendResponse from '../../../shared/sendResponse';

// 1. Create an Appointment
const createAppointment: RequestHandler = catchAsync(async (req, res) => {
  const result = await AppointmentService.createAppointment();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Appointment created successfully',
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
};
