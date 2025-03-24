import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import pick from '../../../shared/pick';
import { adminFilterableFields } from './admin.constant';

// Get All Admins From DB
const getAllAdminFromDB = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await AdminService.getAllAdminFromDB(filters, options);
    res.status(200).json({
      success: true,
      message: 'Admins retrieved successfully',
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
    res.status(200).json({
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
    res.status(200).json({
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

export const AdminController = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminInDB,
};
