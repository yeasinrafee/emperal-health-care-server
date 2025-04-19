import { AppointmentStatus, PaymentStatus, Prescription } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { TAuthUser } from '../../types/common';
import ApiError from '../../errors/ApiError';
import status from 'http-status';

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

export const PrescriptionService = {
  createPrescriptionIntoDB,
};
