import { z } from 'zod';

export const createUmkmSchema = z.object({
  nama: z.string().min(1).max(255),
  deskripsi: z.string(),
  alamat: z.string(),
  nama_pemilik: z.string().min(1).max(255),
  nomor_hp: z.string().min(1).max(255),
  rentang_harga: z.string().min(1).max(255),
  kelengkapan_surat: z.string().min(1).max(255),
  kategori_id: z.number(),
  foto: z.array(
    z.object({
      url_foto: z.string().min(1).max(255),
    }),
  ),
});

export type CreateUmkm = z.infer<typeof createUmkmSchema>;
