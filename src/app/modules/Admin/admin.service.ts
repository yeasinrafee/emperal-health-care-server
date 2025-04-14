import { Admin, Prisma, UserStatus } from '@prisma/client';
import { adminSearchableFields } from './admin.constant';
import { paginationHelper } from '../../../helpers/paginationHelper';
import prisma from '../../../shared/prisma';
import { TAdminFilterRequest } from './admin.types';
import { TPaginationOption } from '../../types/pagination';

// 1. Get All Admins from DB
const getAllAdminFromDB = async (
  params: Partial<TAdminFilterRequest>,
  options: TPaginationOption
) => {
  const { searchTerm, ...filterData } = params;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: Prisma.AdminWhereInput[] = [];
  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  // Search Data
  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
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
  const result = await prisma.admin.findMany({
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

  const total = await prisma.admin.count({
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

// 2. Get Single Admin From DB
const getSingleAdminFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

// 3. Update Admin in DB
const updateAdminInDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  // if not exist, throw error
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

// 4. Delete Admin From DB
const deleteAdminFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });

  return result;
};

// 5. Soft Delete Admin From DB
const softDeleteAdminFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminSoftDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminSoftDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminSoftDeletedData;
  });

  return result;
};

export const AdminService = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminInDB,
  deleteAdminFromDB,
  softDeleteAdminFromDB,
};
