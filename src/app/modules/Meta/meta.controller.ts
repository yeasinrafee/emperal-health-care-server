import { Request, RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { TAuthUser } from '../../types/common';
import { MetaService } from './meta.service';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';

// 1. Fetch Dashboard Meta data
const fetchDashboardMetaData: RequestHandler = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const result = await MetaService.fetchDashboardMetaData(user);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Meta Data fetched successfully!',
      data: result,
    });
  }
);

export const MetaController = {
  fetchDashboardMetaData,
};
