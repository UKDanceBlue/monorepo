-- CreateView
create view fundraising_entries_with_meta (
  id,
  uuid,
  created_at,
  updated_at,
  unassigned,
  db_funds_entry_id
) as
SELECT fundraising_entries.id,
  fundraising_entries.uuid,
  fundraising_entries.created_at,
  fundraising_entries.updated_at,
  (
    SELECT db_funds_team_entries.amount
    FROM db_funds_team_entries
    WHERE db_funds_team_entries.id = fundraising_entries.db_funds_entry_id
  ) - COALESCE(
    (
      SELECT sum(assignment.amount)
      FROM fundraising_assignments assignment
      WHERE assignment.fundraising_id = fundraising_entries.id
    ),
    0::numeric(65, 30)
  ),
  fundraising_entries.db_funds_entry_id
FROM fundraising_entries;