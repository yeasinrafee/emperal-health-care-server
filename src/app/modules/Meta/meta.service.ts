import { UserRole } from '@prisma/client';
import { TAuthUser } from '../../types/common';
import prisma from '../../../shared/prisma';

// 1. Fetch Dashboard Meta data
const fetchDashboardMetaData = async (user: TAuthUser) => {
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      getDoctorMetaData(user as TAuthUser);
      break;
    case UserRole.PATIENT:
      getPatientMetaData(user as TAuthUser);
      break;
    default:
      throw new Error('Invalid user role!');
  }
};

const getSuperAdminMetaData = async () => {};

const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });
};

const getDoctorMetaData = async (user: TAuthUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ['patientId'],
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
    },
  });

  const appointStatusDistribution = await prisma.appointment.groupBy({
    by: ['status'],
    _count: {
      id: true,
    },
    where: {
      doctorId: doctorData.id,
    },
  });

  const formattedAppointmentStatusDistribution = appointStatusDistribution.map(
    ({ status, _count }) => ({
      status,
      count: _count.id,
    })
  );
};

const getPatientMetaData = async (user: TAuthUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const prescriptionCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointStatusDistribution = await prisma.appointment.groupBy({
    by: ['status'],
    _count: {
      id: true,
    },
    where: {
      patientId: patientData.id,
    },
  });

  const formattedAppointmentStatusDistribution = appointStatusDistribution.map(
    ({ status, _count }) => ({
      status,
      count: _count.id,
    })
  );
};

export const MetaService = {
  fetchDashboardMetaData,
};
