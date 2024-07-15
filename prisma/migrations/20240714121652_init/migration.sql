-- CreateTable
CREATE TABLE "umkm" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "nama_pemilik" TEXT NOT NULL,
    "nomor_hp" TEXT NOT NULL,
    "rentang_harga" TEXT NOT NULL,
    "kelengkapan_surat" TEXT NOT NULL,

    CONSTRAINT "umkm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foto_umkm" (
    "id" TEXT NOT NULL,
    "url_foto" TEXT NOT NULL,
    "umkm_id" TEXT NOT NULL,

    CONSTRAINT "foto_umkm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_KategoriToUMKM" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_KategoriToUMKM_AB_unique" ON "_KategoriToUMKM"("A", "B");

-- CreateIndex
CREATE INDEX "_KategoriToUMKM_B_index" ON "_KategoriToUMKM"("B");

-- AddForeignKey
ALTER TABLE "foto_umkm" ADD CONSTRAINT "foto_umkm_umkm_id_fkey" FOREIGN KEY ("umkm_id") REFERENCES "umkm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KategoriToUMKM" ADD CONSTRAINT "_KategoriToUMKM_A_fkey" FOREIGN KEY ("A") REFERENCES "kategori"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KategoriToUMKM" ADD CONSTRAINT "_KategoriToUMKM_B_fkey" FOREIGN KEY ("B") REFERENCES "umkm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
