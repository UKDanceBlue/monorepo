/*
  Warnings:

  - You are about to alter the column `width` on the `images` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `height` on the `images` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "images" ALTER COLUMN "width" SET DATA TYPE INTEGER,
ALTER COLUMN "height" SET DATA TYPE INTEGER;
