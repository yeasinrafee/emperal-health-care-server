import axios from 'axios';
import prisma from '../../../shared/prisma';
import { SSLService } from '../SSL/ssl.service';
import config from '../../../config';
import { PaymentStatus } from '@prisma/client';

// 1. Initiate Payment
const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const initPaymentData = {
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    address: paymentData.appointment.patient.address,
    phoneNumber: paymentData.appointment.patient.contactNumber,
  };

  const result = await SSLService.initPayment(initPaymentData);

  return {
    paymentUrl: result.GatewayPageURL,
  };
};

// 2. Validate Payment
const validatePayment = async (payload: any) => {
  //   if (!payload || !payload.status || !(payload.status === 'VALID')) {
  //     return {
  //       message: 'Invalid payment!',
  //     };
  //   }

  //   const response = await SSLService.validatePayment(payload);

  //   if (response?.status !== 'VALID') {
  //     return {
  //       message: 'Payment Failed!',
  //     };
  //   }

  const response = payload;

  await prisma.$transaction(async (tx) => {
    const updatedPaymentData = await tx.payment.update({
      where: {
        transactionId: response?.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: response,
      },
    });

    await tx.appointment.update({
      where: {
        id: updatedPaymentData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });

  return {
    message: 'Payment Successful!',
  };
};

export const PaymentService = {
  initPayment,
  validatePayment,
};
