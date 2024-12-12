import { sql } from "drizzle-orm";
import {
  bigint,
  date,
  integer,
  numeric,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { batchType, teamLegacyStatus, teamType } from "#schema/enums.sql.js";
import { timestampsBase } from "#schema/fields.sql.js";
import { timestamp } from "#schema/types.sql.js";

export const teamsWithTotalPoints = danceblue
  .view("TeamsWithTotalPoints", {
    id: integer(),
    uuid: uuid(),
    name: text(),
    type: teamType(),
    legacyStatus: teamLegacyStatus(),
    persistentIdentifier: text(),
    marathonId: integer(),
    ...timestampsBase,
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    totalPoints: bigint({ mode: "number" }),
  })
  .as(
    sql`SELECT "Team".id, "Team".uuid, "Team".name, "Team".type, "Team"."legacyStatus", "Team"."persistentIdentifier", "Team"."marathonId", "Team"."createdAt", "Team"."updatedAt", COALESCE(points."totalPoints", 0::bigint) AS "totalPoints" FROM "Team" LEFT JOIN ( SELECT sum(entry.points) AS "totalPoints", entry."teamId" FROM "PointEntry" entry GROUP BY entry."teamId") points ON "Team".id = points."teamId"`
  );

export const fundraisingEntryWithMeta = danceblue
  .view("FundraisingEntryWithMeta", {
    id: integer(),
    uuid: uuid(),
    ...timestampsBase,
    unassigned: numeric(),
    amount: numeric({ precision: 65, scale: 30 }),
    donatedTo: text(),
    donatedBy: text(),
    donatedOn: timestamp({ mode: "string", withTimezone: false }),
    notes: text(),
    enteredByPersonId: integer(),
    solicitationCodeOverrideId: integer(),
    batchTypeOverride: batchType(),
    donatedByOverride: text(),
    donatedOnOverride: date(),
    donatedToOverride: text(),
    amountOverride: numeric({ precision: 65, scale: 30 }),
    solicitationCodeText: text(),
    batchType: batchType(),
  })
  .as(
    sql`SELECT fe.id, fe.uuid, fe."createdAt", fe."updatedAt", COALESCE(fe."amountOverride", dfe.amount, ddn."combinedAmount") - COALESCE(( SELECT sum(assignment.amount) AS sum FROM "FundraisingAssignment" assignment WHERE assignment."fundraisingId" = fe.id), 0::numeric(65,30)) AS unassigned, COALESCE(fe."amountOverride", dfe.amount, ddn."combinedAmount") AS amount, COALESCE(fe."donatedToOverride", dfe."donatedTo", ddn.comment) AS "donatedTo", COALESCE(fe."donatedByOverride", dfe."donatedBy", ddn."combinedDonorName") AS "donatedBy", COALESCE(fe."donatedOnOverride"::timestamp without time zone, dfe.date, ddn."transactionDate"::timestamp without time zone) AS "donatedOn", fe.notes, fe."enteredByPersonId", fe."solicitationCodeId" AS "solicitationCodeOverrideId", fe."batchTypeOverride", fe."donatedByOverride", fe."donatedOnOverride", fe."donatedToOverride", fe."amountOverride", ( SELECT format('%s%4s - %s'::text, sc.prefix, to_char(sc.code, 'fm9999999999999999999999999999999999999999999999990000'::text), sc.name) AS format FROM "SolicitationCode" sc WHERE sc.id = COALESCE(fe."solicitationCodeId", ddn."solicitationCodeId", dft."solicitationCodeId")) AS "solicitationCodeText", CASE WHEN fe."batchTypeOverride" IS NOT NULL THEN fe."batchTypeOverride" WHEN ddn.* IS NULL THEN 'DBFunds'::"BatchType" WHEN ddnb.* IS NULL THEN NULL::"BatchType" WHEN "left"("right"(ddnb."batchId", 2), 1) = 'C'::text THEN 'Check'::"BatchType" WHEN "left"("right"(ddnb."batchId", 2), 1) = 'T'::text THEN 'Transmittal'::"BatchType" WHEN "left"("right"(ddnb."batchId", 2), 1) = 'D'::text THEN 'CreditCard'::"BatchType" WHEN "left"("right"(ddnb."batchId", 2), 1) = 'A'::text THEN 'ACH'::"BatchType" WHEN "left"("right"(ddnb."batchId", 2), 1) = 'N'::text THEN 'NonCash'::"BatchType" WHEN "left"("right"(ddnb."batchId", 2), 1) = 'X'::text THEN 'PayrollDeduction'::"BatchType" ELSE 'Unknown'::"BatchType" END AS "batchType" FROM "FundraisingEntry" fe LEFT JOIN "DailyDepartmentNotification" ddn ON fe.id = ddn."fundraisingEntryId" LEFT JOIN "DailyDepartmentNotificationBatch" ddnb ON ddn."batchId" = ddnb.id LEFT JOIN "DBFundsFundraisingEntry" dfe ON fe.id = dfe."fundraisingEntryId" LEFT JOIN "DBFundsTeam" dft ON dfe."dbFundsTeamId" = dft.id`
  );
