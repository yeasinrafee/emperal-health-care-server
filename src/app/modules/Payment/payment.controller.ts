import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PaymentService } from './payment.service';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';

// 1. Initiate Payment
const initPayment: RequestHandler = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const result = await PaymentService.initPayment(appointmentId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Payment initiated successfully!',
    data: result,
  });
});

// 1. Validate Payment
const validatePayment: RequestHandler = catchAsync(async (req, res) => {
  const result = await PaymentService.validatePayment(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Payment validate successfully!',
    data: result,
  });
});

export const PaymentController = {
  initPayment,
  validatePayment,
};
