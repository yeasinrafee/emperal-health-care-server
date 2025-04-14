import prisma from '../../../shared/prisma';

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
  updateDoctorIntoDB,
};
