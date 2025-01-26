-- CreateEnum
CREATE TYPE "FundraisingEntrySource" AS ENUM ('DBFunds', 'DDN', 'Override');

DROP VIEW "danceblue"."FundraisingEntryWithMeta";

CREATE VIEW "danceblue"."FundraisingEntryWithMeta" AS (
  SELECT "danceblue"."FundraisingEntry"."id",
    "danceblue"."FundraisingEntry"."uuid",
    "danceblue"."FundraisingEntry"."createdAt",
    "danceblue"."FundraisingEntry"."updatedAt",
    COALESCE(
      "danceblue"."FundraisingEntry"."amountOverride",
      "danceblue"."DBFundsFundraisingEntry"."amount",
      "danceblue"."DailyDepartmentNotification"."combinedAmount"
    ) - COALESCE(
      (
        SELECT sum("amount")
        FROM "danceblue"."FundraisingAssignment"
        WHERE "danceblue"."FundraisingAssignment"."fundraisingId" = "danceblue"."FundraisingEntry"."id"
      ),
      0::numeric(65, 30)
    ) AS "unassigned",
    COALESCE(
      "danceblue"."FundraisingEntry"."amountOverride",
      "danceblue"."DBFundsFundraisingEntry"."amount",
      "danceblue"."DailyDepartmentNotification"."combinedAmount"
    ) AS "amount",
    COALESCE(
      "danceblue"."FundraisingEntry"."donatedToOverride",
      "danceblue"."DBFundsFundraisingEntry"."donatedTo",
      "danceblue"."DailyDepartmentNotification"."comment"
    ) AS "donatedTo",
    COALESCE(
      "danceblue"."FundraisingEntry"."donatedByOverride",
      "danceblue"."DBFundsFundraisingEntry"."donatedBy",
      "danceblue"."DailyDepartmentNotification"."combinedDonorName"
    ) AS "donatedBy",
    COALESCE(
      "danceblue"."FundraisingEntry"."donatedOnOverride"::timestamp without time zone,
      "danceblue"."DBFundsFundraisingEntry"."date",
      "danceblue"."DailyDepartmentNotification"."transactionDate"::timestamp without time zone
    ) AS "donatedOn",
    "danceblue"."FundraisingEntry"."notes",
    "danceblue"."FundraisingEntry"."enteredByPersonId",
    "danceblue"."FundraisingEntry"."solicitationCodeOverrideId",
    "danceblue"."FundraisingEntry"."batchTypeOverride",
    "danceblue"."FundraisingEntry"."donatedByOverride",
    "danceblue"."FundraisingEntry"."donatedOnOverride",
    "danceblue"."FundraisingEntry"."donatedToOverride",
    "danceblue"."FundraisingEntry"."amountOverride",
    "danceblue"."SolicitationCode"."text" AS "solicitationCodeText",
    "danceblue"."SolicitationCode"."id" AS "solicitationCodeId",
    CASE
      WHEN "danceblue"."DBFundsFundraisingEntry"."id" IS NOT NULL THEN 'DBFunds'::"FundraisingEntrySource"
      WHEN "danceblue"."DailyDepartmentNotification"."id" IS NOT NULL THEN 'DDN'::"FundraisingEntrySource"
      ELSE 'Override'::"FundraisingEntrySource"
    END AS "source",
    CASE
      WHEN "danceblue"."FundraisingEntry"."batchTypeOverride" IS NOT NULL THEN "danceblue"."FundraisingEntry"."batchTypeOverride"
      WHEN "danceblue"."DailyDepartmentNotification"."id" IS NULL THEN 'DBFunds'::"BatchType"
      WHEN "danceblue"."DailyDepartmentNotificationBatch"."id" IS NULL THEN NULL::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'C'::text THEN 'Check'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'T'::text THEN 'Transmittal'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'D'::text THEN 'CreditCard'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'A'::text THEN 'ACH'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'N'::text THEN 'NonCash'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'X'::text THEN 'PayrollDeduction'::"BatchType"
      ELSE 'Unknown'::"BatchType"
    END AS "batchType"
  FROM "danceblue"."FundraisingEntry"
    LEFT JOIN "danceblue"."FundraisingAssignment" ON "danceblue"."FundraisingEntry"."id" = "danceblue"."FundraisingAssignment"."fundraisingId"
    LEFT JOIN "danceblue"."DailyDepartmentNotification" ON "danceblue"."FundraisingEntry"."id" = "danceblue"."DailyDepartmentNotification"."fundraisingEntryId"
    LEFT JOIN "danceblue"."DailyDepartmentNotificationBatch" ON "danceblue"."DailyDepartmentNotification"."batchId" = "danceblue"."DailyDepartmentNotificationBatch"."id"
    LEFT JOIN "danceblue"."DBFundsFundraisingEntry" ON "danceblue"."FundraisingEntry"."id" = "danceblue"."DBFundsFundraisingEntry"."fundraisingEntryId"
    LEFT JOIN "danceblue"."DBFundsTeam" ON "danceblue"."DBFundsFundraisingEntry"."dbFundsTeamId" = "danceblue"."DBFundsTeam"."id"
    LEFT JOIN "danceblue"."SolicitationCode" ON "danceblue"."SolicitationCode"."id" = COALESCE(
      "danceblue"."FundraisingEntry"."solicitationCodeOverrideId",
      "danceblue"."DailyDepartmentNotification"."solicitationCodeId",
      "danceblue"."DBFundsTeam"."solicitationCodeId"
    )
);