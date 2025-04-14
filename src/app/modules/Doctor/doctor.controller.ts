import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { DoctorService } from './doctor.service';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';
import pick from '../../../shared/pick';
import { doctorFilterableFields } from './doctor.constant';

// 1. Get All Doctors From DB
const getAllDoctorsFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await DoctorService.getAllDoctorFromDB(filters, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Doctors are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// 2. Get Single Admin From DB
const getSingleDoctorFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorService.getSingleDoctorFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Doctor retrieved successfully',
    data: result,
  });
});

const updateDoctorIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await DoctorService.updateDoctorIntoDB(id, data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Doctor data updated!',
    data: result,
  });
});

export const DoctorController = {
  getAllDoctorsFromDB,
  getSingleDoctorFromDB,
  updateDoctorIntoDB,
};
