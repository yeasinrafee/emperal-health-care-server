import { Request, Response } from 'express';
import { AdminService } from './admin.service';

const getAllAdminFromDB = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getAllAdminFromDB(req.query);
    res.status(200).json({
      success: true,
      message: 'Admins retrieved successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || 'Something went wrong!',
      error: err,
    });
  }
};

export const AdminController = {
  getAllAdminFromDB,
};
