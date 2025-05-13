import { Request, RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AuthService } from './auth.service';
import sendResponse from '../../../shared/sendResponse';
import status from 'http-status';

// 1. Login User
const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  const { refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Logged in successfully',
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

// 2. Getting access token using refresh token
const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Fetching access token successfully',
    data: result,
  });
});

const changePassword: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const user = req.user;
    const body = req.body;
    const result = await AuthService.changePassword(user, body);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Password changed successfully',
      data: result,
    });
  }
);

const forgotPassword: RequestHandler = catchAsync(async (req, res) => {
  await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Check your email!',
    data: null,
  });
});

const resetPassword: RequestHandler = catchAsync(async (req, res) => {
  const token = req.headers.authorization || '';
  const body = req.body;
  await AuthService.resetPassword(token, body);

  console.log(token);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Password Reset!',
    data: null,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
