import { addHours, addMinutes, format } from 'date-fns';
import prisma from '../../../shared/prisma';
import { Prisma, Schedule } from '@prisma/client';
import { TSchedule } from './schedule.types';
import { TPaginationOption } from '../../types/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';

// 1. Create Schedule
const createScheduleIntoDB = async (
  payload: TSchedule
): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const intervalTime = 30;

  const schedules = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, 'yyyy-MM-dd')}`,
          Number(startTime.split(':')[0])
        ),
        Number(startTime.split(':')[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, 'yyyy-MM-dd')}`,
          Number(endTime.split(':')[0])
        ),
        Number(endTime.split(':')[1])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, intervalTime),
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

// 2. Get All Schedules
const getAllSchedulesFromDB = async (
  params: Partial<any>,
  options: TPaginationOption
) => {
  const { searchTerm, ...filterData } = params;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: Prisma.ScheduleWhereInput[] = [];
  const whereConditions: Prisma.ScheduleWhereInput = { AND: andConditions };

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
  const result = await prisma.schedule.findMany({
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

export const ScheduleService = {
  createScheduleIntoDB,
  getAllSchedulesFromDB,
};
