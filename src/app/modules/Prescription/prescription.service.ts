import {
  AppointmentStatus,
  PaymentStatus,
  Prescription,
  Prisma,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import { TAuthUser } from '../../types/common';
import ApiError from '../../errors/ApiError';
import status from 'http-status';
import { TPaginationOption } from '../../types/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';

// 1. Create Prescription
const createPrescriptionIntoDB = async (
  user: TAuthUser,
  payload: Partial<Prescription>
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });

  if (!(user?.email === appointmentData?.doctor.email)) {
    throw new ApiError(status.BAD_REQUEST, 'This is not your appointment!');
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData?.id,
      doctorId: appointmentData?.doctorId,
      patientId: appointmentData?.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null || undefined,
    },
    include: {
      patient: true,
    },
  });

  return result;
};

// 2. Get My Prescriptions
const getMyPrescriptionsFromDB = async (
  user: TAuthUser,
  options: TPaginationOption
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const result = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user?.email,
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });

  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user?.email,
      },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// 3. Get All Prescriptions
const getAllPrescriptionsFromDB = async (
  filters: any,
  options: TPaginationOption
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { patientEmail, doctorEmail } = filters;
  const andConditions = [];

  if (patientEmail) {
    andConditions.push({
      patient: {
        email: patientEmail,
      },
    });
  }

  if (doctorEmail) {
    andConditions.push({
      doctor: {
        email: doctorEmail,
      },
    });
  }

  const whereConditions: Prisma.PrescriptionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.prescription.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });
  const total = await prisma.prescription.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const PrescriptionService = {
  createPrescriptionIntoDB,
  getMyPrescriptionsFromDB,
  getAllPrescriptionsFromDB,
};
