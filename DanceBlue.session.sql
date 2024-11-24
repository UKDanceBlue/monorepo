SELECT "fe"."id",
  "ddnb"."batchId",
  right("ddnb"."batchId", 2),
  left(right("ddnb"."batchId", 2), 1),
  CASE
    WHEN "ddn" IS NULL THEN 'DBFunds'
    WHEN "ddnb" IS NULL THEN NULL
    WHEN left(right("ddnb"."batchId", 2), 1) = 'C' THEN 'Check'
    WHEN left(right("ddnb"."batchId", 2), 1) = 'T' THEN 'Transmittal'
    WHEN left(right("ddnb"."batchId", 2), 1) = 'D' THEN 'Credit Card'
    WHEN left(right("ddnb"."batchId", 2), 1) = 'A' THEN 'ACH'
    WHEN left(right("ddnb"."batchId", 2), 1) = 'N' THEN 'Non-Cash'
    WHEN left(right("ddnb"."batchId", 2), 1) = 'X' THEN 'Payroll Deduction'
    ELSE 'Unknown'
  END AS "batchType"
FROM "FundraisingEntry" "fe"
  LEFT OUTER JOIN "DailyDepartmentNotification" "ddn" ON "fe"."id" = "ddn"."fundraisingEntryId"
  LEFT OUTER JOIN "DailyDepartmentNotificationBatch" "ddnb" ON "ddn"."batchId" = "ddnb"."batchId"
  LEFT OUTER JOIN "DBFundsFundraisingEntry" "dfe" ON "fe"."id" = "dfe"."fundraisingEntryId"
  LEFT OUTER JOIN "DBFundsTeam" "dft" ON "dfe"."dbFundsTeamId" = "dft"."id";