import { Request } from 'express';
import { TFile } from '../../types/file';
import { fileUploader } from '../../../helpers/fileUploader';
import prisma from '../../../shared/prisma';

// 1. Create Specialties
const createSpecialtiesIntoDB = async (req: Request) => {
  const file = req.file as TFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

// 2. Get All Specialties
const getAllSpecialtiesFromDB = async () => {
  const result = await prisma.specialties.findMany();
  return result;
};

// 3. Delete Specialties
const deleteSpecialtiesFromDB = async (id: string) => {
  await prisma.specialties.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialtiesService = {
  createSpecialtiesIntoDB,
  getAllSpecialtiesFromDB,
  deleteSpecialtiesFromDB,
};
