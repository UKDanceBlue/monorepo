import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel, CommitteeIdentifier } from "@ukdanceblue/common";
import { Flex } from "antd";

import { SolicitationCodeTable } from "@/elements/tables/fundraising/SolicitationCodeTable";
import { routerAuthCheck } from "@/tools/routerAuthCheck";

export const Route = createFileRoute("/fundraising/solicitation-code/")({
  component: RouteComponent,
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.Admin,
      },
      {
        accessLevel: AccessLevel.CommitteeChairOrCoordinator,
        committeeIdentifier: CommitteeIdentifier.fundraisingCommittee,
      },
    ],
  },
});

function RouteComponent() {
  return (
    <>
      <Flex justify="left" align="center">
        <h1>Solicitation Codes</h1>
      </Flex>
      <SolicitationCodeTable />
    </>
  );
}
