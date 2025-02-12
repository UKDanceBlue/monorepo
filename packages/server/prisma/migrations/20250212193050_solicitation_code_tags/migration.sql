-- CreateEnum
CREATE TYPE "SolicitationCodeTag" AS ENUM ('MiniMarathon', 'DancerTeam', 'Active', 'General');

-- AlterTable
ALTER TABLE "SolicitationCode" ADD COLUMN     "tags" "SolicitationCodeTag"[] DEFAULT ARRAY[]::"SolicitationCodeTag"[];
