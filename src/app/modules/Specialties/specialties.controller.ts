import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';
import { SpecialtiesService } from './specialties.service';

// 1. Create Specialties
const createSpecialtiesIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await SpecialtiesService.createSpecialtiesIntoDB(req);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Specialties created successfully',
    data: result,
  });
});

// 2. Get All Specialties
const getAllSpecialtiesFromDB: RequestHandler = catchAsync(async (req, res) => {
  const result = await SpecialtiesService.getAllSpecialtiesFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Specialties are retrieved successfully',
    data: result,
  });
});

// 2. Delete Specialties
const deleteSpecialtiesFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SpecialtiesService.deleteSpecialtiesFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Specialties deleted successfully',
    data: result,
  });
});

export const SpecialtiesController = {
  createSpecialtiesIntoDB,
  getAllSpecialtiesFromDB,
  deleteSpecialtiesFromDB,
};
