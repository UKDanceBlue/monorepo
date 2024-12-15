SELECT
  "FundraisingEntry".id,
  "FundraisingEntry".uuid,
  "FundraisingEntry"."createdAt",
  "FundraisingEntry"."updatedAt",
  (
    COALESCE(
      "FundraisingEntry"."amountOverride",
      "DBFundsFundraisingEntry".amount,
      "DailyDepartmentNotification"."combinedAmount"
    ) - COALESCE(
      (
        SELECT
          sum(assignment.amount) AS sum
        FROM
          "FundraisingAssignment" assignment
        WHERE
          (
            assignment."fundraisingId" = "FundraisingEntry".id
          )
      ),
      (0) :: numeric(65, 30)
    )
  ) AS unassigned,
  COALESCE(
    "FundraisingEntry"."amountOverride",
    "DBFundsFundraisingEntry".amount,
    "DailyDepartmentNotification"."combinedAmount"
  ) AS amount,
  COALESCE(
    "FundraisingEntry"."donatedToOverride",
    "DBFundsFundraisingEntry"."donatedTo",
    "DailyDepartmentNotification".comment
  ) AS "donatedTo",
  COALESCE(
    "FundraisingEntry"."donatedByOverride",
    "DBFundsFundraisingEntry"."donatedBy",
    "DailyDepartmentNotification"."combinedDonorName"
  ) AS "donatedBy",
  COALESCE(
    ("FundraisingEntry"."donatedOnOverride") :: timestamp without time zone,
    "DBFundsFundraisingEntry".date,
    ("DailyDepartmentNotification"."transactionDate") :: timestamp without time zone
  ) AS "donatedOn",
  "FundraisingEntry".notes,
  "FundraisingEntry"."enteredByPersonId",
  "FundraisingEntry"."solicitationCodeOverrideId",
  "FundraisingEntry"."batchTypeOverride",
  "FundraisingEntry"."donatedByOverride",
  "FundraisingEntry"."donatedOnOverride",
  "FundraisingEntry"."donatedToOverride",
  "FundraisingEntry"."amountOverride",
  (
    SELECT
      format(
        '%s%4s - %s' :: text,
        sc.prefix,
        to_char(
          sc.code,
          'fm9999999999999999999999999999999999999999999999990000' :: text
        ),
        sc.name
      ) AS format
    FROM
      "SolicitationCode" sc
    WHERE
      (
        sc.id = COALESCE(
          "FundraisingEntry"."solicitationCodeOverrideId",
          "DailyDepartmentNotification"."solicitationCodeId",
          "DBFundsTeam"."solicitationCodeId"
        )
      )
  ) AS "solicitationCodeText",
  CASE
    WHEN (
      "FundraisingEntry"."batchTypeOverride" IS NOT NULL
    ) THEN "FundraisingEntry"."batchTypeOverride"
    WHEN ("DailyDepartmentNotification".id IS NULL) THEN 'DBFunds' :: "BatchType"
    WHEN ("DailyDepartmentNotificationBatch".id IS NULL) THEN NULL :: "BatchType"
    WHEN (
      "left"(
        "right"("DailyDepartmentNotificationBatch"."batchId", 2),
        1
      ) = 'C' :: text
    ) THEN 'Check' :: "BatchType"
    WHEN (
      "left"(
        "right"("DailyDepartmentNotificationBatch"."batchId", 2),
        1
      ) = 'T' :: text
    ) THEN 'Transmittal' :: "BatchType"
    WHEN (
      "left"(
        "right"("DailyDepartmentNotificationBatch"."batchId", 2),
        1
      ) = 'D' :: text
    ) THEN 'CreditCard' :: "BatchType"
    WHEN (
      "left"(
        "right"("DailyDepartmentNotificationBatch"."batchId", 2),
        1
      ) = 'A' :: text
    ) THEN 'ACH' :: "BatchType"
    WHEN (
      "left"(
        "right"("DailyDepartmentNotificationBatch"."batchId", 2),
        1
      ) = 'N' :: text
    ) THEN 'NonCash' :: "BatchType"
    WHEN (
      "left"(
        "right"("DailyDepartmentNotificationBatch"."batchId", 2),
        1
      ) = 'X' :: text
    ) THEN 'PayrollDeduction' :: "BatchType"
    ELSE 'Unknown' :: "BatchType"
  END AS "batchType"
FROM
  (
    (
      (
        (
          (
            "FundraisingEntry"
            LEFT JOIN "FundraisingAssignment" ON (
              (
                "FundraisingEntry".id = "FundraisingAssignment"."fundraisingId"
              )
            )
          )
          LEFT JOIN "DailyDepartmentNotification" ON (
            (
              "FundraisingEntry".id = "DailyDepartmentNotification"."fundraisingEntryId"
            )
          )
        )
        LEFT JOIN "DailyDepartmentNotificationBatch" ON (
          (
            "DailyDepartmentNotification"."batchId" = "DailyDepartmentNotificationBatch".id
          )
        )
      )
      LEFT JOIN "DBFundsFundraisingEntry" ON (
        (
          "FundraisingEntry".id = "DBFundsFundraisingEntry"."fundraisingEntryId"
        )
      )
    )
    LEFT JOIN "DBFundsTeam" ON (
      (
        "DBFundsFundraisingEntry"."dbFundsTeamId" = "DBFundsTeam".id
      )
    )
  );