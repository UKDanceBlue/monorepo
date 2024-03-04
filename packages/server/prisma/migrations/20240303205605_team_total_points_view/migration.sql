-- Create the teams_with_total_points view

create view teams_with_total_points
            (id, uuid, name, type, legacyStatus, persistentIdentifier, marathonYear, createdAt, updatedAt,
             totalPoints) as
SELECT teams.id,
       teams.uuid,
       teams.name,
       teams.type,
       teams.legacy_status                     AS legacyStatus,
       teams.persistent_identifier             AS persistentIdentifier,
       teams.marathon_year                     AS marathonYear,
       teams.created_at                        AS createdAt,
       teams.updated_at                        AS updatedAt,
       COALESCE(points.totalPoints, 0::bigint) AS totalPoints
FROM teams
         LEFT JOIN (SELECT sum(entry.points) AS totalPoints,
                           entry.team_id
                    FROM point_entries entry
                    GROUP BY entry.team_id) points ON teams.id = points.team_id;

