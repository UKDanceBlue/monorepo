-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotification_idSorter_transactionDate_batchI_key" ON "DailyDepartmentNotification"(
  "idSorter",
  "transactionDate",
  "batchId",
  "solicitationCodeId",
  "comment",
  "combinedAmount"
);

-- DropIndex
DROP INDEX "DailyDepartmentNotification_idSorter_transactionDate_batchI_key";

-- AlterTable
ALTER TABLE "DailyDepartmentNotification"
ALTER COLUMN "processDate"
SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotification_idSorter_processDate_batchId_so_key" ON "DailyDepartmentNotification"(
  "idSorter",
  "processDate",
  "batchId",
  "solicitationCodeId",
  "comment",
  "combinedAmount"
);

-- DropIndex
DROP INDEX "DailyDepartmentNotification_idSorter_processDate_batchId_so_key";

-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotification_idSorter_processDate_batchId_so_key" ON "DailyDepartmentNotification"(
  "idSorter",
  "processDate",
  "batchId",
  "solicitationCodeId",
  "combinedAmount"
);

DROP INDEX "DailyDepartmentNotification_idSorter_key";

DROP VIEW IF EXISTS "FundraisingEntryWithMeta";

CREATE VIEW "FundraisingEntryWithMeta" AS
SELECT "fe"."id",
  "fe"."uuid",
  "fe"."createdAt",
  "fe"."updatedAt",
  COALESCE(
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
    "dfe"."amount",
    "ddn"."combinedAmount"
  ) AS "amount",
  COALESCE("dfe"."donatedTo", "ddn"."comment") AS "donatedTo",
  COALESCE(
    "dfe"."donatedBy",
    "ddn"."combinedDonorName"
  ) AS "donatedBy",
  COALESCE("dfe"."date", "ddn"."transactionDate") AS "donatedOn",
  "fe"."notes",
  "fe"."enteredByPersonId",
  "fe"."solicitationCodeId" AS "solicitationCodeOverrideId",
  (
    SELECT format(
        '%s%4s - %s',
        "sc"."prefix",
        to_char("sc"."code", 'fm0000'),
        "sc"."name"
      )
    FROM "SolicitationCode" "sc"
    WHERE "sc"."id" = COALESCE(
        "fe"."solicitationCodeId",
        "ddn"."solicitationCodeId",
        "dft"."solicitationCodeId"
      )
  ) AS "solicitationCodeText"
FROM "FundraisingEntry" "fe"
  LEFT OUTER JOIN "DailyDepartmentNotification" "ddn" ON "fe"."id" = "ddn"."fundraisingEntryId"
  LEFT OUTER JOIN "DBFundsFundraisingEntry" "dfe" ON "fe"."id" = "dfe"."fundraisingEntryId"
  LEFT OUTER JOIN "DBFundsTeam" "dft" ON "dfe"."dbFundsTeamId" = "dft"."id";