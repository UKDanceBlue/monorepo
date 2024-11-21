import { createFileRoute, Link } from "@tanstack/react-router";
import { AccessLevel } from "@ukdanceblue/common";
import { Button, Flex } from "antd";

import { useAuthorizationRequirement } from "@/hooks/useLoginState.js";
import { routerAuthCheck } from "@/tools/routerAuthCheck.js";

function ViewTeamPage() {
  const canSeePoints = useAuthorizationRequirement({
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  });

  return (
    <Flex justify="space-evenly" align="center">
      <div
        style={{
          marginTop: "1em",
          backgroundColor: "lightcyan",
          borderRadius: "1em",
          padding: "1em",
          gap: "1em",
          display: "flex",
        }}
      >
        <Link to="fundraising" from="/teams/$teamId/">
          <Button type="primary">Fundraising</Button>
        </Link>
        {canSeePoints && (
          <Link to="points" from="/teams/$teamId/">
            <Button type="primary">Spirit Points</Button>
          </Link>
        )}
      </div>
    </Flex>
  );
}

export const Route = createFileRoute("/teams/$teamId/_layout/")({
  component: ViewTeamPage,
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.UKY,
      },
    ],
  },
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
});
