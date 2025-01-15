CREATE VIEW "TeamWithMeta" AS
SELECT "Team".*,
  COALESCE(SUM("PointEntry"."points"), 0) AS "totalPoints"
FROM "Team"
  LEFT JOIN "PointEntry" ON "Team"."id" = "PointEntry"."teamId"
GROUP BY "Team"."id";