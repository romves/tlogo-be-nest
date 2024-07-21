import { createId } from '@paralleldrive/cuid2';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: bcrypt.hashSync('admin1234', 10),
      role: 'ADMIN',
    },
  });
  const user2 = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      password: bcrypt.hashSync('user1234', 10),
      role: 'USER',
    },
  });
  const cuidUmkm = 'cjozv9v5z0000a3z1z1q6z7z1';
  const cuidFoto = createId();
  const umkm1 = await prisma.uMKM.upsert({
    where: { id: cuidUmkm },
    update: {},
    create: {
      id: cuidUmkm,
      nama: 'UMKM 1',
      alamat: 'Jl. Raya',
      nomor_hp: '08123456789',
      nama_pemilik: 'Pemilik 1',
      kelengkapan_surat: 'NPWP',
      rentang_harga: '>=200.000',
      foto: {
        create: {
          id: cuidFoto,
          url_foto: 'https://via.placeholder.com/150',
        },
      },
      produk: 'Makanan Ringan',
      koordinat_umkm: ['-8.122907', '112.1971171'],
      volume: '120ml',
    },
  });

  console.log({ umkm1 });
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
