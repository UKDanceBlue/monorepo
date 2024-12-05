import { BarsOutlined, FileOutlined, UploadOutlined } from "@ant-design/icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AccessLevel, CommitteeIdentifier } from "@ukdanceblue/common";
import { Button, Flex } from "antd";
import { useState } from "react";
import { useQuery } from "urql";

import { FundraisingReportDialog } from "#elements/components/fundraising/FundraisingReportDialog";
import {
  FundraisingEntriesTable,
  FundraisingEntryTableFragment,
} from "#elements/tables/fundraising/FundraisingEntriesTable";
import { graphql } from "#graphql/index";
import { useListQuery } from "#hooks/useListQuery";
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
  const [result] = useQuery({
    query: ViewTeamFundraisingDocument,
    variables: {
      page: 1,
      pageSize: 10,
    },
  });

  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  useQueryStatusWatcher(result);

  const listQuery = useListQuery(
    {
      initPage: 1,
      initPageSize: 10,
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
          <Button
            icon={<FileOutlined />}
            size="large"
            onClick={() => setReportDialogOpen(true)}
          >
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
      <FundraisingReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
      />
    </>
  );
}
