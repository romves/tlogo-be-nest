-- AlterTable
ALTER TABLE "umkm" ADD COLUMN     "sheet_timestamp" TIMESTAMP(3),
ALTER COLUMN "kelengkapan_surat" DROP NOT NULL,
ALTER COLUMN "koordinat_umkm" SET DATA TYPE TEXT[];

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
