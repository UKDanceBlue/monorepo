/*
  Warnings:

  - You are about to drop the column `image_data` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `mime_type` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `images` table. All the data in the column will be lost.
  - Added the required column `file_id` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "images_url_unique";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "image_data",
DROP COLUMN "mime_type",
DROP COLUMN "url",
ADD COLUMN     "file_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "uploaded_files" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "mime_type" VARCHAR(127) NOT NULL,
    "mime_subtype" VARCHAR(127) NOT NULL,
    "mime_parameters" TEXT[],
    "location_url" TEXT NOT NULL,
    "requires_login" BOOLEAN NOT NULL DEFAULT false,
    "owned_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "uploaded_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uploaded_files_uuid_unique" ON "uploaded_files"("uuid");

-- CreateIndex
CREATE INDEX "uploaded_files_uuid" ON "uploaded_files"("uuid");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "uploaded_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploaded_files" ADD CONSTRAINT "uploaded_files_owned_by_fkey" FOREIGN KEY ("owned_by") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;
