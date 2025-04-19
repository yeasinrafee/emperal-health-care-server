import axios from 'axios';
import config from '../../../config';
import prisma from '../../../shared/prisma';

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

  console.log(paymentData);

  const data = {
    store_id: config.ssl.storeId,
    store_passwd: config.ssl.storePass,
    total_amount: paymentData.amount,
    currency: 'BDT',
    tran_id: paymentData.transactionId, // use unique tran_id for each api call
    success_url: config.ssl.successUrl,
    fail_url: config.ssl.failUrl,
    cancel_url: config.ssl.cancelUrl,
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: 'N/A',
    product_name: 'Appointment Payment',
    product_category: 'Service',
    product_profile: 'general',
    cus_name: paymentData.appointment.patient.name,
    cus_email: paymentData.appointment.patient.email,
    cus_add1: paymentData.appointment.patient.address,
    cus_add2: 'N/A',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: paymentData.appointment.patient.contactNumber,
    cus_fax: '01711111111',
    ship_name: 'N/A',
    ship_add1: 'N/A',
    ship_add2: 'N/A',
    ship_city: 'N/A',
    ship_state: 'N/A',
    ship_postcode: 1000,
    ship_country: 'N/A',
  };

  const response = await axios({
    method: 'post',
    url: config.ssl.sslPaymentApi,
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  console.log(response.data);
};

export const PaymentService = {
  initPayment,
};
