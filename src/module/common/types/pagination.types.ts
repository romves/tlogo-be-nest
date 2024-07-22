import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().optional(),
});

export type TPagination = z.infer<typeof paginationSchema>;
