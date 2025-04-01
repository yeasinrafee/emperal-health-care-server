import { RequestHandler } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';
import pick from '../../../shared/pick';
import { userFilterableFields } from './user.constant';

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

// Get All Users From DB
const getAllUsersFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await UserService.getAllUsersFromDB(filters, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// Change User Status
const changeProfileStatus: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await UserService.changeProfileStatus(id, data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users profile status changed successfully',
    data: result,
  });
});

export const UserController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsersFromDB,
  changeProfileStatus,
};
