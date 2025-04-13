import { Request } from 'express';
import { TFile } from '../../types/file';
import { fileUploader } from '../../../helpers/fileUploader';
import prisma from '../../../shared/prisma';

// Create Specialties
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

export const SpecialtiesService = {
  createSpecialtiesIntoDB,
};
