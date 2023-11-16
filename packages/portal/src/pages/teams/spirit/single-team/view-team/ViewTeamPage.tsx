import { PointEntryTable } from "@elements/tables/point-entry/PointEntryTable";
import { TeamViewer } from "@elements/viewers/team/TeamViewer";
import { useParams } from "@tanstack/react-router";

export function ViewTeamPage() {
  const { teamId } = useParams({ from: "/teams/$teamId/" });
  return (
    <div>
      <h1>View Team</h1>
      <TeamViewer uuid={teamId} />
      <PointEntryTable teamUuid={teamId} />
    </div>
  );
}
