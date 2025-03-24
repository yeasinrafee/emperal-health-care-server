import { NextFunction, Request, Response } from 'express';
import { AdminService } from './admin.service';
import pick from '../../../shared/pick';
import { adminFilterableFields } from './admin.constant';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';

// Get All Admins From DB
const getAllAdminFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (err: any) {
    next(err);
  }
};

// Get Single Admin From DB
const getSingleAdminFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await AdminService.getSingleAdminFromDB(id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Admin retrieved successfully',
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

// Update Admin in DB
const updateAdminInDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await AdminService.updateAdminInDB(id, data);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Admin updated successfully!',
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

// Delete Admin From DB
const deleteAdminFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await AdminService.deleteAdminFromDB(id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Admin deleted successfully!',
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

// Soft Delete Admin From DB
const softDeleteAdminFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await AdminService.softDeleteAdminFromDB(id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Admin deleted successfully!',
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const AdminController = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminInDB,
  deleteAdminFromDB,
  softDeleteAdminFromDB,
};
