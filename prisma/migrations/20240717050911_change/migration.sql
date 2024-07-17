/*
  Warnings:

  - You are about to drop the column `deskripsi` on the `umkm` table. All the data in the column will be lost.
  - You are about to drop the `_KategoriToUMKM` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kategori` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `produk` to the `umkm` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_KategoriToUMKM" DROP CONSTRAINT "_KategoriToUMKM_A_fkey";

-- DropForeignKey
ALTER TABLE "_KategoriToUMKM" DROP CONSTRAINT "_KategoriToUMKM_B_fkey";

-- AlterTable
ALTER TABLE "umkm" DROP COLUMN "deskripsi",
ADD COLUMN     "koordinat_umkm" TEXT[],
ADD COLUMN     "produk" TEXT NOT NULL,
ADD COLUMN     "volume" TEXT;

-- DropTable
DROP TABLE "_KategoriToUMKM";

-- DropTable
DROP TABLE "kategori";
