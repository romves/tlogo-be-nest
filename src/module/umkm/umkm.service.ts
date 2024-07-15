import { HttpException, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UmkmService {
  constructor(private prisma: PrismaService) {}

  async getAllUmkm() {
    const umkms = await this.prisma.uMKM.findMany({
      include: {
        foto: true,
      },
    });
    return {
      message: 'Success',
      data: umkms,
    };
  }

  async getUmkmById(id: string) {
    const umkm = await this.prisma.uMKM.findFirst({
      where: {
        id,
      },
    });

    if (!umkm) throw new HttpException('Umkm not found', 404);

    return {
      message: 'Success',
      data: umkm,
    };
  }

  async createUmkm(data: any) {
    console.log(data);
    const umkm = await this.prisma.uMKM.create({
      data: {
        id: createId(),
        nama: data.nama,
        deskripsi: data.deskripsi,
        alamat: data.alamat,
        nama_pemilik: data.nama_pemilik,
        nomor_hp: data.nomor_hp,
        rentang_harga: data.rentang_harga,
        kelengkapan_surat: data.kelengkapan_surat,
        kategori: data.kategori,
        foto: {
          create: data.foto.map((foto: any) => ({
            ...foto,
            id: createId(),
          })),
        },
      },
    });

    return {
      message: 'Success',
      data: umkm,
    };
  }

  async deleteUmkm(id: string) {
    try {
      const umkm = await this.prisma.uMKM.findFirstOrThrow({
        where: {
          id,
        },
        include: {
          foto: true,
        },
      });

      if (umkm.foto.length) {
        await this.prisma.fotoUMKM.deleteMany({
          where: {
            umkm_id: id,
          },
        });
      }

      await this.prisma.uMKM.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Delete success',
        data: umkm,
      };
    } catch (error) {
      throw new HttpException('Umkm not found', 404);
    }
  }

  async updateUmkm(id: string, data: any) {
    try {
      const transaction = await this.prisma.$transaction(async (tx) => {
        const umkm = await tx.uMKM.findFirstOrThrow({
          where: {
            id,
          },
        });
  
        if (!umkm) throw new HttpException('Umkm not found', 404);
  
        if (data.foto) {
          await tx.fotoUMKM.deleteMany({
            where: {
              umkm_id: id,
            },
          });
  
          await tx.fotoUMKM.createMany({
            data: data.foto.map((foto: any) => ({
              ...foto,
              id: createId(),
              umkm_id: id,
            })),
          });
        }
  
        const umkmUpdated = await tx.uMKM.update({
          where: {
            id,
          },
          data: {
            nama: data.nama,
            deskripsi: data.deskripsi,
            alamat: data.alamat,
            nama_pemilik: data.nama_pemilik,
            nomor_hp: data.nomor_hp,
            rentang_harga: data.rentang_harga,
            kelengkapan_surat: data.kelengkapan_surat,
            kategori: data.kategori,
          },
        });

        return umkmUpdated;
      })  

      return {
        message: 'Update success',
        data: transaction,
      };
      
    } catch (error) {
      return {
        message: 'Umkm not found',
        data: null
      }
    }
  }
}
