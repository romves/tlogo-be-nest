/*
  Warnings:

  - The `koordinat_umkm` column on the `umkm` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "umkm" DROP COLUMN "koordinat_umkm",
ADD COLUMN     "koordinat_umkm" INTEGER[];
