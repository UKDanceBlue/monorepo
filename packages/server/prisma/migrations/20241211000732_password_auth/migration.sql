-- AlterEnum
ALTER TYPE "AuthSource" ADD VALUE 'Password';

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "hashedPassword" BYTEA,
ADD COLUMN     "salt" BYTEA;
