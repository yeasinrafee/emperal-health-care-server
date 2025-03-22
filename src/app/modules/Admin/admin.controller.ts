import { Request, Response } from 'express';
import { AdminService } from './admin.service';

const getAllAdminFromDB = async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdminFromDB();
  res.status(200).json({
    success: true,
    message: 'Admins retrieved successfully',
    data: result,
  });
};

export const AdminController = {
  getAllAdminFromDB,
};
