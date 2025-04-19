import status from 'http-status';
import prisma from '../../../shared/prisma';
import ApiError from '../../errors/ApiError';
import { TAuthUser } from '../../types/common';

// 1. Create Review
const createReviewIntoDB = async (user: TAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });

  if (patientData.id !== appointmentData.patientId) {
    throw new ApiError(status.BAD_REQUEST, 'This is not your appointment!');
  }

  const result = await prisma.review.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });

  return result;
};

export const ReviewService = {
  createReviewIntoDB,
};
