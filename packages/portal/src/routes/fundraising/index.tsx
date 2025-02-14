import {
  BarsOutlined,
  FileOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CommitteeIdentifier, CommitteeRole } from "@ukdanceblue/common";
import { Button, Collapse, Flex } from "antd";

import { useMarathon } from "#config/marathonContext.ts";
import { CustomFundraisingEntryUploadButton } from "#elements/forms/fundraising-entry/CustomFundraisingEntryUploadButton.tsx";
import { FundraisingEntriesTable } from "#elements/tables/fundraising/FundraisingEntriesTable";
import { graphql } from "#gql/index.ts";
import {
  useAuthorizationRequirement,
  useLoginState,
} from "#hooks/useLoginState.js";
import { useTypedCustomQuery } from "#hooks/useTypedRefine.ts";

export const Route = createFileRoute("/fundraising/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { authorization } = useLoginState();
  const showTotal =
    authorization?.effectiveCommitteeRoles.find(
      ({ identifier }) => identifier === CommitteeIdentifier.overallCommittee
    )?.role === CommitteeRole.Chair;

  const { id: marathonId, year } = useMarathon() ?? {};
  const grandTotal = useTypedCustomQuery({
    document: graphql(/* GraphQL */ `
      query GrandTotal($marathonId: GlobalId!) {
        grandTotal(marathonId: $marathonId)
      }
    `),
    props: {
      queryOptions: {
        enabled: showTotal && marathonId != null,
      },
    },
    gqlVariables: {
      marathonId,
    },
  });

  return (
    <List
      title="Fundraising Entries"
      headerButtons={
        <>
          {useAuthorizationRequirement("create", {
            kind: "FundraisingEntryNode",
          }) && (
            <Link from="/fundraising" to="create">
              <Button icon={<PlusOutlined />} size="large">
                Create Entry
              </Button>
            </Link>
          )}
          {useAuthorizationRequirement("list", {
            kind: "DailyDepartmentNotificationNode",
          }) && (
            <Link from="/fundraising" to="ddn">
              <Button icon={<BarsOutlined />} size="large">
                View Raw DDNs
              </Button>
            </Link>
          )}
          {useAuthorizationRequirement("create", {
            kind: "DailyDepartmentNotificationNode",
          }) && (
            <>
              <Link from="/fundraising" to="ddn/upload">
                <Button icon={<UploadOutlined />} size="large">
                  Upload a DDN
                </Button>
              </Link>
              <CustomFundraisingEntryUploadButton />
            </>
          )}
          {useAuthorizationRequirement("list", {
            kind: "FundraisingEntryNode",
          }) && (
            <Link from="/fundraising" to="report">
              <Button icon={<FileOutlined />} size="large">
                Generate Report
              </Button>
            </Link>
          )}
        </>
      }
    >
      <Flex vertical gap="large">
        {grandTotal.data && (
          <Collapse
            items={[
              {
                label: "Grand Total (For Overall Chair's Eyes Only",
                children: (
                  <Flex justify="center" vertical>
                    <img
                      style={{
                        width: "100%",
                        maxWidth: "60ch",
                        display: "block",
                      }}
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/%22Loose_lips_might_sink_ships%22_-_NARA_-_513543.jpg/800px-%22Loose_lips_might_sink_ships%22_-_NARA_-_513543.jpg"
                    />
                    <p>
                      Grand total for {year} fiscal year:{" "}
                      <span className="hide-unless-hover">
                        ${String(grandTotal.data.data.grandTotal)}
                      </span>{" "}
                      (hover to view)
                    </p>
                  </Flex>
                ),
              },
            ]}
          />
        )}
        <FundraisingEntriesTable showSolicitationCode />
      </Flex>
    </List>
  );
}
