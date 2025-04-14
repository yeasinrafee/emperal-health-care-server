import { Prisma } from '@prisma/client';
import { paginationHelper } from '../../../helpers/paginationHelper';
import prisma from '../../../shared/prisma';
import { TPaginationOption } from '../../types/pagination';
import { TDoctorFilterRequest } from './doctor.types';
import { doctorSearchableFields } from './doctor.constant';

// 1. Get All Admins from DB
const getAllDoctorFromDB = async (
  params: Partial<TDoctorFilterRequest>,
  options: TPaginationOption
) => {
  const { searchTerm, ...filterData } = params;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: Prisma.DoctorWhereInput[] = [];
  const whereConditions: Prisma.DoctorWhereInput = { AND: andConditions };

  // Search Data
  if (params.searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: 'insensitive',
        },
      })),
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
  andConditions.push({
    isDeleted: false,
  });

  // Pagination and sorting
  const result = await prisma.doctor.findMany({
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

  const total = await prisma.doctor.count({
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

const updateDoctorIntoDB = async (id: string, payload: any) => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updatedDoctorData = await prisma.doctor.update({
    where: {
      id,
    },
    data: payload,
  });

  return updatedDoctorData;
};

export const DoctorService = {
  getAllDoctorFromDB,
  updateDoctorIntoDB,
};
