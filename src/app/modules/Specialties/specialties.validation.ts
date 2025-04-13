import { z } from 'zod';

const createSpecialtiesZodValidation = z.object({
  title: z.string({
    required_error: 'Title is required!',
  }),
});

export const SpecialtiesValidation = {
  createSpecialtiesZodValidation,
};
