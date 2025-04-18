import { Patient, Prisma, UserStatus } from '@prisma/client';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { TPaginationOption } from '../../types/pagination';
import { TPatientFilterRequest, TUpdatePatientResponse } from './patient.types';
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
    include: {
      patientHealthData: true,
      medicalReport: true,
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
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  return result;
};

// 3. Update Patient in DB
const updatePatientInDB = async (
  id: string,
  data: Partial<TUpdatePatientResponse>
): Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...patientData } = data;
  //   if not exist, throw error
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    // updating patient data
    await transactionClient.patient.update({
      where: {
        id,
      },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReport: true,
      },
    });

    // create or update patient health data
    if (patientHealthData) {
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthData,
        create: {
          ...patientHealthData,
          patientId: patientInfo.id,
        },
      });
    }

    if (medicalReport) {
      await transactionClient.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });

  const responseData = await prisma.patient.findUnique({
    where: {
      id: patientInfo.id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  return responseData;
};

// 4. Delete Patient From DB
const deletePatientFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.$transaction(async (tx) => {
    // deleting medical report first
    await tx.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });

    // deleting patient health data
    await tx.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });

    // deleting patient
    const deletedPatient = await tx.patient.delete({
      where: {
        id,
      },
    });

    // deleting user
    await tx.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });

    return deletedPatient;
  });

  return result;
};

// 5. Soft Delete Patient From DB
const softDeletePatientFromDB = async (id: string): Promise<Patient | null> => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const patientSoftDeletedData = await transactionClient.patient.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: patientSoftDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return patientSoftDeletedData;
  });

  return result;
};

export const PatientService = {
  getAllPatientFromDB,
  getSinglePatientFromDB,
  updatePatientInDB,
  deletePatientFromDB,
  softDeletePatientFromDB,
};
