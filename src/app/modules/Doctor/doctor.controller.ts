import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { DoctorService } from './doctor.service';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';

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
  updateDoctorIntoDB,
};
