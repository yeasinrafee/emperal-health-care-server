import { Prisma } from '@prisma/client';
import { paginationHelper } from '../../../helpers/paginationHelper';
import prisma from '../../../shared/prisma';
import { TAuthUser } from '../../types/common';
import { TPaginationOption } from '../../types/pagination';

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

// 2. Get My Schedules
const getMySchedulesFromDB = async (
  params: Partial<any>,
  options: TPaginationOption,
  user: TAuthUser
) => {
  const { startDate, endDate, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

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
  });

  const total = await prisma.doctorSchedules.count({
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

export const DoctorScheduleService = {
  createDoctorScheduleIntoDB,
  getMySchedulesFromDB,
};
