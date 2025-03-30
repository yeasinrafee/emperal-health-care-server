import { RequestHandler } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';

const createAdmin: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserService.createAdmin(req);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const createDoctor: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserService.createDoctor(req);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Doctor created successfully',
    data: result,
  });
});

const createPatient: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserService.createPatient(req);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Patient created successfully',
    data: result,
  });
});

export const UserController = {
  createAdmin,
  createDoctor,
  createPatient,
};
