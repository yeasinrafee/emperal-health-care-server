import { Prisma } from '@prisma/client';
import { paginationHelper } from '../../../helpers/paginationHelper';
import prisma from '../../../shared/prisma';
import { TAuthUser } from '../../types/common';
import { TPaginationOption } from '../../types/pagination';
import ApiError from '../../errors/ApiError';
import status from 'http-status';

// 1. Create Doctor Schedule
const createDoctorScheduleIntoDB = async (
  user: any,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return result;
};

// 2. Get All Schedules
const getAllSchedulesFromDB = async (
  params: Partial<any>,
  options: TPaginationOption
) => {
  const { startDate, endDate, ...filterData } = params;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const andConditions: Prisma.ScheduleWhereInput[] = [];
  const whereConditions: Prisma.ScheduleWhereInput = {
    AND: andConditions,
  };

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
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
  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {},
    include: {
      doctor: true,
      schedule: true,
    },
  });

  const total = await prisma.schedule.count({
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

// 3. Get My Schedules
const getMySchedulesFromDB = async (
  params: Partial<any>,
  options: TPaginationOption,
  user: TAuthUser
) => {
  const { startDate, endDate, ...filterData } = params;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];
  const whereConditions: Prisma.DoctorSchedulesWhereInput = {
    AND: andConditions,
  };

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  // Filter data
  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === 'string' &&
      filterData.isBooked === 'true'
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === 'string' &&
      filterData.isBooked === 'false'
    ) {
      filterData.isBooked = false;
    }

    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  // Pagination and sorting
  const result = await prisma.doctorSchedules.findMany({
    where: {
      ...whereConditions,
      doctorId: doctorData.id,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {},
  });

  const total = await prisma.doctorSchedules.count({
    where: {
      ...whereConditions,
      doctorId: doctorData.id,
    },
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

// 4. Delete my Schedule
const deleteMySchedule = async (user: TAuthUser, scheduleId: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: scheduleId,

      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new ApiError(
      status.BAD_REQUEST,
      'You can not delete a booked schedule!'
    );
  }

  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleId,
      },
    },
  });

  return result;
};

export const DoctorScheduleService = {
  createDoctorScheduleIntoDB,
  getAllSchedulesFromDB,
  getMySchedulesFromDB,
  deleteMySchedule,
};
