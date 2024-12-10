/*
  Warnings:

  - You are about to drop the `Edit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FundraisingEntryEdit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Edit" DROP CONSTRAINT "Edit_editingUserId_fkey";

-- DropForeignKey
ALTER TABLE "FundraisingEntryEdit" DROP CONSTRAINT "FundraisingEntryEdit_editId_fkey";

-- DropForeignKey
ALTER TABLE "FundraisingEntryEdit" DROP CONSTRAINT "FundraisingEntryEdit_fundraisingEntryId_fkey";

-- DropTable
DROP TABLE "Edit";

-- DropTable
DROP TABLE "FundraisingEntryEdit";

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "summary" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "editingUserId" INTEGER,
    "subjectGlobalId" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuditLog_uuid_key" ON "AuditLog"("uuid");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_editingUserId_fkey" FOREIGN KEY ("editingUserId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
