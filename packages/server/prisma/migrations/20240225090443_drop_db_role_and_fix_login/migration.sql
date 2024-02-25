/*
  Warnings:

  - You are about to drop the column `db_role` on the `people` table. All the data in the column will be lost.
  - Made the column `code_verifier` on table `login_flow_sessions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `set_cookie` on table `login_flow_sessions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `send_token` on table `login_flow_sessions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "login_flow_sessions" ALTER COLUMN "code_verifier" SET NOT NULL,
ALTER COLUMN "set_cookie" SET NOT NULL,
ALTER COLUMN "send_token" SET NOT NULL;

-- AlterTable
ALTER TABLE "people" DROP COLUMN "db_role";

-- DropEnum
DROP TYPE "enum_people_db_role";
