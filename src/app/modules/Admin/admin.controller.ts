import { RequestHandler } from 'express';
import { AdminService } from './admin.service';
import pick from '../../../shared/pick';
import { adminFilterableFields } from './admin.constant';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';
import catchAsync from '../../../shared/catchAsync';

// 1. Get All Admins From DB
const getAllAdminFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await AdminService.getAllAdminFromDB(filters, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admins are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// 2. Get Single Admin From DB
const getSingleAdminFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.getSingleAdminFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin retrieved successfully',
    data: result,
  });
});

// 3. Update Admin in DB
const updateAdminInDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await AdminService.updateAdminInDB(id, data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin updated successfully!',
    data: result,
  });
});

// 4. Delete Admin From DB
const deleteAdminFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminService.deleteAdminFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin deleted successfully!',
    data: result,
  });
});

// 5. Soft Delete Admin From DB
const softDeleteAdminFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminService.softDeleteAdminFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin deleted successfully!',
    data: result,
  });
});

export const AdminController = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminInDB,
  deleteAdminFromDB,
  softDeleteAdminFromDB,
};
