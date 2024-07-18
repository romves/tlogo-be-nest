import { z } from 'zod';

export const loginPayloadSchema = z.object({
  username: z.string().min(1, 'Username tidak boleh kosong'),
  password: z.string().min(8, 'Password harus lebih dari 8 karakter'),
});

export type LoginPayload = z.infer<typeof loginPayloadSchema>;