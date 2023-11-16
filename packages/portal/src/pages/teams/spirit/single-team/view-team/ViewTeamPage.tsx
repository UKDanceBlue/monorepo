import { PointEntryCreator } from "@elements/forms/point-entry/create/PointEntryCreator";
import { PointEntryTable } from "@elements/tables/point-entry/PointEntryTable";
import { TeamViewer } from "@elements/viewers/team/TeamViewer";
import { useParams } from "@tanstack/react-router";
import { Flex } from "antd";

export function ViewTeamPage() {
  const { teamId } = useParams({ from: "/teams/$teamId/" });
  return (
    <div>
      <h1>View Team</h1>
      <Flex gap="1em" vertical>
        <h2>Team Details</h2>
        <TeamViewer uuid={teamId} />
        <Flex gap="1em">
          <div style={{ flex: 1 }}>
            <h2>Point Entries</h2>
            <PointEntryTable teamUuid={teamId} />
          </div>
          <div style={{ flex: 1 }}>
            <h2>Create Point Entry</h2>
            <PointEntryCreator teamUuid={teamId} />
          </div>
        </Flex>
      </Flex>
    </div>
  );
}
