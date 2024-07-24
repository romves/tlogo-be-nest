import { HttpException, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { parse } from 'papaparse';
import { Readable } from 'stream';
import { PrismaService } from '../common/prisma/prisma.service';

import { isAfter } from 'date-fns';
import { TPagination } from '../common/types/pagination.types';

@Injectable()
export class UmkmService {
  constructor(private prisma: PrismaService) {}

  async getAllUmkm(query: TPagination) {
    const defaultPerPage = 10;
    query.perPage = query.perPage || defaultPerPage;
    query.page = query.page || 1;

    const skip = (query.page - 1) * query.perPage;

    const totalCount = await this.prisma.uMKM.count();

    const totalPages = Math.ceil(totalCount / query.perPage);

    const umkms = await this.prisma.uMKM.findMany({
      skip: skip,
      take: Number(query.perPage),
      include: {
        foto: true,
      },
    });

    return {
      message: 'success',
      data: umkms,
      meta: {
        page: query.page,
        perPage: query.perPage,
        totalPages: totalPages,
        totalCount: totalCount,
      },
    };
  }

  async getUmkmById(id: string) {
    const umkm = await this.prisma.uMKM.findFirst({
      where: {
        id,
      },
      include: {
        foto: true,
      },
    });

    if (!umkm) throw new HttpException('Umkm not found', 404);

    return {
      message: 'success',
      data: umkm,
    };
  }

  async createUmkm(data: any) {
    const umkm = await this.prisma.uMKM.create({
      data: {
        id: createId(),
        nama: data.nama,
        alamat: data.alamat,
        koordinat_umkm: this.convertCoordinate(data.koordinat_umkm),
        nama_pemilik: data.nama_pemilik,
        nomor_hp: data.nomor_hp,
        rentang_harga: data.rentang_harga,
        kelengkapan_surat: data.kelengkapan_surat,
        produk: data.produk,
        volume: data.volume,
        sheet_timestamp: new Date().toISOString(),
        ...(data.foto && data.foto.length > 0
          ? {
              foto: {
                create: data.foto.map((foto: any) => ({
                  ...foto,
                  id: createId(),
                })),
              },
            }
          : {}),
      },
    });

    return {
      message: 'success',
      data: umkm,
    };
  }

  async deleteUmkm(id: string) {
    // TODO Implement Transaction
    const umkm = await this.prisma.$transaction(async (tx) => {
      const umkm = await tx.uMKM.findFirst({
        where: {
          id,
        },
        include: {
          foto: true,
        },
      });

      if (!umkm) throw new HttpException('Umkm not found', 404);

      if (umkm.foto.length) {
        await tx.fotoUMKM.deleteMany({
          where: {
            umkm_id: id,
          },
        });
      }

      await tx.uMKM.delete({
        where: {
          id,
        },
      });

      return umkm;
    });

    return {
      message: 'Delete success',
      data: umkm,
    };
  }

  async updateUmkm(id: string, data: any) {
    const transaction = await this.prisma.$transaction(async (tx) => {
      const umkm = await tx.uMKM.findFirst({
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
          alamat: data.alamat,
          koordinat_umkm: this.convertCoordinate(data.koordinat_umkm),
          nama_pemilik: data.nama_pemilik,
          nomor_hp: data.nomor_hp,
          rentang_harga: data.rentang_harga,
          kelengkapan_surat: data.kelengkapan_surat,
          produk: data.produk,
          volume: data.volume,
        },
      });

      return umkmUpdated;
    });

    return {
      message: 'Update success',
      data: transaction,
    };
  }

  async createUmkmBatchCSV(file: any) {
    const data = Readable.from(file.buffer);

    const parsedData = await new Promise((resolve, reject) => {
      parse(data, {
        header: true,
        worker: true,
        complete: async (results) => {
          const cleanedData = results.data
            .map((row) => {
              // delete row['Timestamp'];
              // delete row['Nama Produk'];
              // delete row['Produk'];
              delete row['Volume'];
              // delete row['Harga '];
              delete row['Harga'];
              delete row['Email Address'];
              delete row['Nama Produk_1'];
              // delete row['Volume_1'];

              if (row['Timestamp'] == '') return;

              if (row['Titik Koordinat Toko'] == '') return;

              row['Nomor HP'] = row['Nomor HP'].replace(/^0/g, '62');

              row['Titik Koordinat Toko'] = row['Titik Koordinat Toko'].replace(/[^0-9.,+-]/g, '');
              
              if (new Date(row['Timestamp']) instanceof Date && isNaN(new Date(row['Timestamp']).getTime())) {
                row['Timestamp'] = new Date().toISOString();
              }

              return row;
            })
            .filter((row) => row != null || row != undefined);

          const latestData = await this.prisma.uMKM.findFirst({
            orderBy: {
              sheet_timestamp: 'asc',
            },
          });

          let latestTimestamp = null;

          if (latestData && latestData?.sheet_timestamp) {
            latestTimestamp = latestData.sheet_timestamp;
          }

          const filteredData = cleanedData.filter((row) => {
            if (latestTimestamp) {
              return isAfter(latestTimestamp, new Date(row['Timestamp']));
            }

            return row;
          });

          const umkms = await Promise.all(
            filteredData.map(async (data, i) => {
              const allFotos = [
                ...(data['Gambar UMKM'] ? data['Gambar UMKM'].split(',') : []),
                ...(data['Foto Produk'] ? data['Foto Produk'].split(',') : []),
              ];


              const umkm = await this.prisma.uMKM.create({
                data: {
                  id: createId(),
                  nama: data['Nama Toko'],
                  alamat: data['Alamat'] ?? '',
                  koordinat_umkm: this.convertCoordinate(
                    data['Titik Koordinat Toko'],
                  ),
                  nama_pemilik: data['Nama Pemilik'],
                  nomor_hp: data['Nomor HP'],
                  rentang_harga: data['Rentang Harga'] ?? '',
                  kelengkapan_surat: data['Surat'],
                  produk: data['Kategori'] || data['Produk'],
                  volume: data['Volume'] ?? '',
                  sheet_timestamp: new Date(data['Timestamp']),
                  foto: {
                    create: allFotos.map((foto) => ({
                      id: createId(),
                      url_foto: this.convertGoogleDriveImageUrl(foto),
                    })),
                  },
                },
              });

              return umkm;
            }),
          );
          resolve(filteredData);
        },
        error: (error) => {
          reject(error);
        },
      });
    });

    return {
      message: `Tambah ${(<unknown[]>parsedData).length} UMKM dari CSV berhasil`,
      data: parsedData,
    };
  }

  convertCoordinate(coordinate: string) {
    const converted = coordinate.split(',');

    if (converted.length == 4) {
      return [
        converted[0] + '.' + converted[1],
        converted[2] + '.' + converted[3],
      ];
    }

    return converted;
  }

  convertGoogleDriveImageUrl(url: string) {
    const splitUrl = url.split('id=');
    const fileId = splitUrl[1];
    const convertedUrl = `https://drive.google.com/thumbnail?id=${fileId}`;

    return convertedUrl;
  }
}
