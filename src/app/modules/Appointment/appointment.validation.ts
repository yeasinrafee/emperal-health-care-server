import { z } from 'zod';

const createAppointmentZodValidation = z.object({
  body: z.object({
    doctorId: z.string({
      required_error: 'Doctor Id is required!',
    }),
    scheduleId: z.string({
      required_error: 'Schedule Id is required!',
    }),
  }),
});

export const AppointmentValidation = {
  createAppointmentZodValidation,
};
