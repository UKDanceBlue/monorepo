-- AlterTable
DROP VIEW "FundraisingEntryWithMeta";

ALTER TABLE "FundraisingEntry"
ADD COLUMN "amountOverride" DECIMAL(65, 30),
    ADD COLUMN "batchTypeOverride" "BatchType",
    ADD COLUMN "donatedByOverride" TEXT,
    ADD COLUMN "donatedOnOverride" DATE,
    ADD COLUMN "donatedToOverride" TEXT;

-- CreateTable
CREATE TABLE "Edit" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "summary" TEXT NOT NULL,
    "action" JSONB NOT NULL,
    "editingUserId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fundraisingEntryId" INTEGER,
    CONSTRAINT "Edit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundraisingEntryEdit" (
    "fundraisingEntryId" INTEGER NOT NULL,
    "editId" INTEGER NOT NULL,
    CONSTRAINT "FundraisingEntryEdit_pkey" PRIMARY KEY ("fundraisingEntryId", "editId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Edit_uuid_key" ON "Edit"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "FundraisingEntryEdit_editId_key" ON "FundraisingEntryEdit"("editId");

-- AddForeignKey
ALTER TABLE "Edit"
ADD CONSTRAINT "Edit_editingUserId_fkey" FOREIGN KEY ("editingUserId") REFERENCES "Person"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingEntryEdit"
ADD CONSTRAINT "FundraisingEntryEdit_fundraisingEntryId_fkey" FOREIGN KEY ("fundraisingEntryId") REFERENCES "FundraisingEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingEntryEdit"
ADD CONSTRAINT "FundraisingEntryEdit_editId_fkey" FOREIGN KEY ("editId") REFERENCES "Edit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE VIEW "FundraisingEntryWithMeta" AS
SELECT "fe"."id",
    "fe"."uuid",
    "fe"."createdAt",
    "fe"."updatedAt",
    COALESCE(
        "fe"."amountOverride",
        -- Calculate unassigned using db_funds_team_entries if available
        "dfe"."amount",
        -- Otherwise, use combinedAmount from DailyDepartmentNotification
        "ddn"."combinedAmount"
    ) - COALESCE(
        (
            SELECT SUM("assignment"."amount")
            FROM "FundraisingAssignment" "assignment"
            WHERE "assignment"."fundraisingId" = "fe"."id"
        ),
        0::numeric(65, 30)
    ) AS "unassigned",
    COALESCE(
        "fe"."amountOverride",
        "dfe"."amount",
        "ddn"."combinedAmount"
    ) AS "amount",
    COALESCE(
        "fe"."donatedToOverride",
        "dfe"."donatedTo",
        "ddn"."comment"
    ) AS "donatedTo",
    COALESCE(
        "fe"."donatedByOverride",
        "dfe"."donatedBy",
        "ddn"."combinedDonorName"
    ) AS "donatedBy",
    COALESCE(
        "fe"."donatedOnOverride",
        "dfe"."date",
        "ddn"."transactionDate"
    ) AS "donatedOn",
    "fe"."notes",
    "fe"."enteredByPersonId",
    "fe"."solicitationCodeId" AS "solicitationCodeOverrideId",
    "fe"."batchTypeOverride",
    "fe"."donatedByOverride",
    "fe"."donatedOnOverride",
    "fe"."donatedToOverride",
    "fe"."amountOverride",
    (
        SELECT format(
                '%s%4s - %s',
                "sc"."prefix",
                to_char(
                    "sc"."code",
                    'fm9999999999999999999999999999999999999999999999990000'
                ),
                "sc"."name"
            )
        FROM "SolicitationCode" "sc"
        WHERE "sc"."id" = COALESCE(
                "fe"."solicitationCodeId",
                "ddn"."solicitationCodeId",
                "dft"."solicitationCodeId"
            )
    ) AS "solicitationCodeText",
    CASE
        WHEN "fe"."batchTypeOverride" IS NOT NULL THEN "fe"."batchTypeOverride"
        WHEN "ddn" IS NULL THEN 'DBFunds'::"BatchType"
        WHEN "ddnb" IS NULL THEN NULL
        WHEN left(right("ddnb"."batchId", 2), 1) = 'C' THEN 'Check'::"BatchType"
        WHEN left(right("ddnb"."batchId", 2), 1) = 'T' THEN 'Transmittal'::"BatchType"
        WHEN left(right("ddnb"."batchId", 2), 1) = 'D' THEN 'CreditCard'::"BatchType"
        WHEN left(right("ddnb"."batchId", 2), 1) = 'A' THEN 'ACH'::"BatchType"
        WHEN left(right("ddnb"."batchId", 2), 1) = 'N' THEN 'NonCash'::"BatchType"
        WHEN left(right("ddnb"."batchId", 2), 1) = 'X' THEN 'PayrollDeduction'::"BatchType"
        ELSE 'Unknown'::"BatchType"
    END AS "batchType"
FROM "FundraisingEntry" "fe"
    LEFT OUTER JOIN "DailyDepartmentNotification" "ddn" ON "fe"."id" = "ddn"."fundraisingEntryId"
    LEFT OUTER JOIN "DailyDepartmentNotificationBatch" "ddnb" ON "ddn"."batchId" = "ddnb"."id"
    LEFT OUTER JOIN "DBFundsFundraisingEntry" "dfe" ON "fe"."id" = "dfe"."fundraisingEntryId"
    LEFT OUTER JOIN "DBFundsTeam" "dft" ON "dfe"."dbFundsTeamId" = "dft"."id";