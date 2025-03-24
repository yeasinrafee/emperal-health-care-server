import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import pick from '../../../shared/pick';
import { adminFilterableFields } from './admin.constant';
import sendResponse from '../../../shared/sendResponse';

// Get All Admins From DB
const getAllAdminFromDB = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await AdminService.getAllAdminFromDB(filters, options);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admins are retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Something went wrong!',
      error: err,
    });
  }
};

// Get Single Admin From DB
const getSingleAdminFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminService.getSingleAdminFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin retrieved successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Something went wrong!',
      error: err,
    });
  }
};

// Update Admin in DB
const updateAdminInDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await AdminService.updateAdminInDB(id, data);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin updated successfully!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Something went wrong!',
      error: err,
    });
  }
};

// Delete Admin From DB
const deleteAdminFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.deleteAdminFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin deleted successfully!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Something went wrong!',
      error: err,
    });
  }
};

// Soft Delete Admin From DB
const softDeleteAdminFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await AdminService.softDeleteAdminFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin deleted successfully!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Something went wrong!',
      error: err,
    });
  }
};

export const AdminController = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminInDB,
  deleteAdminFromDB,
  softDeleteAdminFromDB,
};
