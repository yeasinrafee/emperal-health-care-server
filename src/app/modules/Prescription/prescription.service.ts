import { AppointmentStatus, PaymentStatus, Prescription } from '@prisma/client';
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

export const PrescriptionService = {
  createPrescriptionIntoDB,
  getMyPrescriptionsFromDB,
};
