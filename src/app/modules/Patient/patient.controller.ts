import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { patientFilterableFields } from './patient.constant';
import { PatientService } from './patient.service';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';

// 1. Get All Patient From DB
const getAllPatientFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await PatientService.getAllPatientFromDB(filters, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Patients are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// 2. Get Single Patient From DB
const getSinglePatientFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientService.getSinglePatientFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Patient retrieved successfully',
    data: result,
  });
});

// 3. Update Patient in DB
const updatePatientInDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await PatientService.updatePatientInDB(id, data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Patient updated successfully!',
    data: result,
  });
});

// 4. Delete Patient From DB
const deletePatientFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PatientService.deletePatientFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Patient deleted successfully!',
    data: result,
  });
});

// 5. Soft Delete Patient From DB
const softDeletePatientFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PatientService.softDeletePatientFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Patient deleted successfully!',
    data: result,
  });
});

export const PatientController = {
  getAllPatientFromDB,
  getSinglePatientFromDB,
  updatePatientInDB,
  deletePatientFromDB,
  softDeletePatientFromDB,
};
