-- This is an empty migration.
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
        '%s%s - %s',
        "sc"."prefix",
        "sc"."code",
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