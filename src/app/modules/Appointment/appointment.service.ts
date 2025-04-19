import { v4 as uuidv4 } from 'uuid';
import prisma from '../../../shared/prisma';
import { TAuthUser } from '../../types/common';
import { TPaginationOption } from '../../types/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import {
  AppointmentStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from '@prisma/client';
import ApiError from '../../errors/ApiError';

// 1. Create an appointment
const createAppointment = async (user: TAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId: string = uuidv4();

  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    const today = new Date();
    const transactionId =
      'Emperal-HealthCare' +
      today.getFullYear() +
      '-' +
      today.getMonth() +
      '-' +
      today.getDate() +
      '-' +
      today.getHours() +
      '-' +
      today.getMinutes();

    await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    return appointmentData;
  });

  return result;
};

// 2. Get All Appointments
const getAllAppointment = async (filters: any, options: TPaginationOption) => {
  const { ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: Prisma.AppointmentWhereInput[] = [];
  const whereConditions: Prisma.AppointmentWhereInput = { AND: andConditions };

  // Filter data
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // Pagination and sorting
  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
    include: {
      doctor: true,
      patient: true,
      schedule: true,
    },
  });

  const total = await prisma.appointment.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// 3. Get My Appointments
const getMyAppointment = async (
  user: TAuthUser,
  filters: any,
  options: TPaginationOption
) => {
  const { ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: Prisma.AppointmentWhereInput[] = [];
  const whereConditions: Prisma.AppointmentWhereInput = { AND: andConditions };

  if (user?.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  } else if (user?.role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user?.email,
      },
    });
  }

  // Filter data
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // Pagination and sorting
  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
    include:
      user?.role === UserRole.PATIENT
        ? { doctor: true, schedule: true }
        : {
            patient: {
              include: { medicalReport: true, patientHealthData: true },
            },
            schedule: true,
          },
  });

  const total = await prisma.appointment.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// 4. Change Appointment Status
const changeAppointmentStatus = async (
  id: string,
  status: AppointmentStatus,
  user: TAuthUser
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      doctor: true,
    },
  });

  if (user?.role === UserRole.DOCTOR) {
    if (user.email !== appointmentData?.doctor?.email) {
      throw new ApiError(
        500,
        'You are not authorized to change this appointment status!'
      );
    }
  }

  const result = await prisma.appointment.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  return result;
};

// 5. cancel unpaid appointments
const cancelUnpaidAppointments = async () => {
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
  const unPaidAppointments = await prisma.appointment.findMany({
    where: {
      createdAt: {
        lte: thirtyMinAgo,
      },
      paymentStatus: PaymentStatus.UNPAID,
    },
  });

  const appointmentIdsToCancel = unPaidAppointments.map(
    (appointment) => appointment.id
  );

  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentIdsToCancel,
        },
      },
    });

    await tx.appointment.deleteMany({
      where: {
        id: {
          in: appointmentIdsToCancel,
        },
      },
    });

    for (const unPaidAppointment of unPaidAppointments) {
      await tx.doctorSchedules.updateMany({
        where: {
          doctorId: unPaidAppointment.doctorId,
          scheduleId: unPaidAppointment.scheduleId,
        },
        data: {
          isBooked: false,
        },
      });
    }
  });
};

export const AppointmentService = {
  createAppointment,
  getAllAppointment,
  getMyAppointment,
  changeAppointmentStatus,
  cancelUnpaidAppointments,
};
