import { z } from 'zod';

export const querySchema = z.object({
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().optional(),
  search: z.string().optional(),
});

export type TQuery = z.infer<typeof querySchema>;
