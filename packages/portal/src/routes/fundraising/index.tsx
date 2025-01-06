import { BarsOutlined, FileOutlined, UploadOutlined } from "@ant-design/icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Flex } from "antd";
import { useQuery } from "urql";

import {
  FundraisingEntriesTable,
  FundraisingEntryTableFragment,
} from "#elements/tables/fundraising/FundraisingEntriesTable";
import { graphql } from "#graphql/index";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";

const ViewTeamFundraisingDocument = graphql(
  /* GraphQL */ `
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
  `,
  [FundraisingEntryTableFragment]
);

export const Route = createFileRoute("/fundraising/")({
  component: RouteComponent,
});

function RouteComponent() {
  const listQuery = useListQuery(
    {
      initPage: 1,
      initPageSize: 20,
      initSorting: [{ field: "donatedOn", direction: "desc" }],
    },
    {
      allFields: [
        "donatedOn",
        "createdAt",
        "updatedAt",
        "amount",
        "amountUnassigned",
        "teamId",
        "batchType",
        "donatedTo",
        "donatedBy",
        "solicitationCode",
      ],
      dateFields: ["donatedOn", "createdAt", "updatedAt"],
      numericFields: ["amount", "amountUnassigned"],
      oneOfFields: ["teamId", "batchType"],
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
          <Link from="/fundraising" to="report">
            <Button icon={<FileOutlined />} size="large">
              Generate Report
            </Button>
          </Link>
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
