import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SortDirection } from "@ukdanceblue/common";
import { Button, Flex } from "antd";
import { useQuery } from "urql";

import { useMarathon } from "#config/marathonContext.js";
import { PaginationFragment } from "#documents/shared.ts";
import { TeamsTable, TeamsTableFragment } from "#elements/tables/TeamsTable.js";
import { graphql } from "#graphql/index";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";

const teamsTableQueryDocument = graphql(
  /* GraphQL */ `
    query TeamsTable(
      $page: Int
      $pageSize: Int
      $sortBy: [String!]
      $sortDirection: [SortDirection!]
      $isNullFilters: [TeamResolverKeyedIsNullFilterItem!]
      $oneOfFilters: [TeamResolverKeyedOneOfFilterItem!]
      $stringFilters: [TeamResolverKeyedStringFilterItem!]
    ) {
      teams(
        page: $page
        pageSize: $pageSize
        sortBy: $sortBy
        sortDirection: $sortDirection
        isNullFilters: $isNullFilters
        oneOfFilters: $oneOfFilters
        stringFilters: $stringFilters
      ) {
        ...PaginationFragment
        data {
          ...TeamsTableFragment
        }
      }
    }
  `,
  [TeamsTableFragment, PaginationFragment]
);

export function ListTeamsPage() {
  const selectedMarathon = useMarathon();

  const listQuery = useListQuery(
    {
      initPage: 1,
      initPageSize: 20,
      initSorting: [{ field: "totalPoints", direction: SortDirection.desc }],
    },
    {
      allFields: ["name", "type", "legacyStatus", "marathonId", "totalPoints"],
      dateFields: [],
      booleanFields: [],
      isNullFields: [],
      numericFields: ["totalPoints"],
      oneOfFields: ["type", "marathonId", "legacyStatus"],
      stringFields: ["name"],
    }
  );

  const [{ fetching, error, data }] = useQuery({
    query: teamsTableQueryDocument,
    variables: listQuery.queryOptions,
    requestPolicy: "network-only",
  });
  useQueryStatusWatcher({
    fetching,
    error,
    loadingMessage: "Loading teams...",
  });

  return (
    <>
      <Flex justify="space-between" align="center">
        <h1>Teams</h1>
        {useAuthorizationRequirement("create", "TeamNode") && (
          <div style={{ display: "flex", gap: 16 }}>
            <Link from="/teams" to="create">
              <Button icon={<PlusOutlined />} size="large">
                Create Team
              </Button>
            </Link>
            <Link from="/teams" to="bulk">
              <Button icon={<UploadOutlined />} size="large">
                Bulk Create Teams
              </Button>
            </Link>
          </div>
        )}
      </Flex>
      <TeamsTable
        selectedMarathonId={selectedMarathon?.id}
        dataFragment={data?.teams.data}
        paginationFragment={data?.teams}
        listQuery={listQuery}
        loading={fetching}
      />
    </>
  );
}

export const Route = createFileRoute("/teams/")({
  component: ListTeamsPage,
});
