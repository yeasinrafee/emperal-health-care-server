import { Patient, Prisma } from '@prisma/client';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { TPaginationOption } from '../../types/pagination';
import { TPatientFilterRequest } from './patient.types';
import { patientSearchableFields } from './patient.constant';
import prisma from '../../../shared/prisma';

// 1. Get All Patient from DB
const getAllPatientFromDB = async (
  params: Partial<TPatientFilterRequest>,
  options: TPaginationOption
) => {
  const { searchTerm, ...filterData } = params;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: Prisma.PatientWhereInput[] = [];
  const whereConditions: Prisma.PatientWhereInput = { AND: andConditions };

  // Search Data
  if (params.searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
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
  const result = await prisma.patient.findMany({
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

  const total = await prisma.patient.count({
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

// 2. Get Single Patient From DB
const getSinglePatientFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

// 3. Update Patient in DB
const updatePatientInDB = async (
  id: string,
  data: Partial<Patient>
): Promise<Patient | null> => {
  // if not exist, throw error
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.patient.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

export const PatientService = {
  getAllPatientFromDB,
  getSinglePatientFromDB,
  updatePatientInDB,
};
