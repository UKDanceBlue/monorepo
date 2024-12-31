CREATE VIEW "EventWithOccurrences" AS
SELECT "e"."id",
  "e"."uuid",
  "e"."createdAt",
  "e"."updatedAt",
  "e"."title",
  "e"."summary",
  "e"."description",
  "e"."location",
  "e"."remoteId",
  "eo"."firstOccurrence",
  "eo"."lastOccurrence"
FROM "Event" "e"
  LEFT JOIN (
    SELECT "eventId",
      MIN("date") AS "firstOccurrence",
      MAX("date") AS "lastOccurrence"
    FROM "EventOccurrence"
    GROUP BY "eventId"
  ) "eo" ON "e"."id" = "eo"."eventId";