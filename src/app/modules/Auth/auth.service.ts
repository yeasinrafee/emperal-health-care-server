import { UserStatus } from '@prisma/client';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import * as bcrypt from 'bcrypt';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import emailSender from './emailSender';
import ApiError from '../../errors/ApiError';
import status from 'http-status';

// 1. Login the user
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  // Checking if password is correct or not
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  // if password in false then throw error
  if (!isCorrectPassword) {
    throw new Error('Password incorrect!');
  }

  // generating access token
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  // generating refresh token
  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
    refreshToken,
  };
};

// 2. Getting access token using refresh Token
const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new Error('You are not authorized!');
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  // generating access token
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );
  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

// 3. Change password
const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  // Checking if password is correct or not
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  // if password in false then throw error
  if (!isCorrectPassword) {
    throw new Error('Password incorrect!');
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: 'Password changed successfully',
  };
};

// 4. Forgot password
const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPasswordToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  const resetPassLink =
    config.reset_pass_link +
    `?userId=${userData.id}&token=${resetPasswordToken}`;

  await emailSender(
    userData.email,
    `
    <div>
      <P>Dear User,</P>
      <p>Your password reset link: 
        <a href=${resetPassLink}>
          <button>
            Reset Password
          </button>
        </a>
      </p>
    </div>
    `
  );

  console.log(resetPassLink);
};

// 5. Reset password
const resetPassword = async (
  token: string,
  payload: {
    id: string;
    password: string;
  }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_token_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(status.FORBIDDEN, 'Forbidden!!');
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
