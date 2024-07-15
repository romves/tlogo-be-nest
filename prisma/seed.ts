import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const cuidUmkm = 'cjozv9v5z0000a3z1z1q6z7z1';
  const cuidFoto = 'cjozv9v5z0000a3z1z1q6z7z1';
  const kategori = await prisma.kategori.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nama: 'Makanan',
    },
  });
  const umkm1 = await prisma.uMKM.upsert({
    where: { id: cuidUmkm },
    update: {},
    create: {
      id: cuidUmkm,
      nama: 'UMKM 1',
      alamat: 'Jl. Raya',
      nomor_hp: '08123456789',
      nama_pemilik: 'Pemilik 1',
      deskripsi: '',
      kelengkapan_surat: 'NPWP',
      rentang_harga: '> 200.000',
      foto: {
        create: {
          id: cuidFoto,
          url_foto: 'https://via.placeholder.com/150',
        },
      },
      kategori: {
        connect: {
          id: 1,
        },
      },
    },
  });
  console.log({ umkm1, kategori });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
