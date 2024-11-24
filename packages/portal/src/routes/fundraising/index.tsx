import { BarsOutlined, FileOutlined, UploadOutlined } from "@ant-design/icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AccessLevel, CommitteeIdentifier } from "@ukdanceblue/common";
import { Button, Flex } from "antd";
import { useQuery } from "urql";

import { FundraisingEntriesTable } from "@/elements/tables/fundraising/FundraisingEntriesTable";
import { graphql } from "@/graphql/gql";
import { useListQuery } from "@/hooks/useListQuery";
import { useQueryStatusWatcher } from "@/hooks/useQueryStatusWatcher";
import { routerAuthCheck } from "@/tools/routerAuthCheck";

const ViewTeamFundraisingDocument = graphql(/* GraphQL */ `
  query ViewFundraisingEntriesDocument(
    $page: Int
    $pageSize: Int
    $sortBy: [String!]
    $sortDirection: [SortDirection!]
    $dateFilters: [FundraisingEntryResolverKeyedDateFilterItem!]
    $oneOfFilters: [FundraisingEntryResolverKeyedOneOfFilterItem!]
    $stringFilters: [FundraisingEntryResolverKeyedStringFilterItem!]
    $numericFilters: [FundraisingEntryResolverKeyedNumericFilterItem!]
  ) {
    fundraisingEntries(
      page: $page
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      dateFilters: $dateFilters
      oneOfFilters: $oneOfFilters
      stringFilters: $stringFilters
      numericFilters: $numericFilters
    ) {
      ...FundraisingEntryTableFragment
    }
  }
`);

export const Route = createFileRoute("/fundraising/")({
  component: RouteComponent,
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
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
});

function RouteComponent() {
  const [result] = useQuery({
    query: ViewTeamFundraisingDocument,
    variables: {
      page: 1,
      pageSize: 10,
    },
  });

  useQueryStatusWatcher(result);

  const listQuery = useListQuery(
    {
      initPage: 1,
      initPageSize: 10,
      initSorting: [],
    },
    {
      allFields: [
        "donatedOn",
        "createdAt",
        "updatedAt",
        "amount",
        "amountUnassigned",
        "teamId",
        "donatedTo",
        "donatedBy",
        "solicitationCode",
      ],
      dateFields: ["donatedOn", "createdAt", "updatedAt"],
      numericFields: ["amount", "amountUnassigned"],
      oneOfFields: ["teamId"],
      stringFields: ["donatedTo", "donatedBy", "solicitationCode"],
      booleanFields: [],
      isNullFields: [],
    }
  );

  const [{ data, fetching, error }, refreshFundraisingEntries] = useQuery({
    query: ViewTeamFundraisingDocument,
    variables: listQuery.queryOptions,
  });
  useQueryStatusWatcher({ fetching, error });

  return (
    <>
      <Flex justify="space-between" align="center">
        <h1>Fundraising Entries</h1>
        <div style={{ display: "flex", gap: 16 }}>
          <Link from="/fundraising" to="ddn">
            <Button icon={<BarsOutlined />} size="large">
              View Raw DDNs
            </Button>
          </Link>
          <Button icon={<FileOutlined />} size="large">
            Generate Report
          </Button>
          <Link from="/fundraising" to="ddn/upload">
            <Button icon={<UploadOutlined />} size="large">
              Upload a DDN
            </Button>
          </Link>
        </div>
      </Flex>
      <FundraisingEntriesTable
        data={data?.fundraisingEntries}
        form={listQuery}
        refresh={() =>
          refreshFundraisingEntries({ requestPolicy: "network-only" })
        }
        loading={fetching}
        showSolicitationCode
      />
    </>
  );
}
