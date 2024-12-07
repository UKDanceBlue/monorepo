import { createFileRoute } from "@tanstack/react-router";
import { AutoComplete, Button, Card, Flex, Form, Space } from "antd";
import { useState } from "react";
import { useMutation, useQuery } from "urql";

import {
  FundraisingEntriesTable,
  FundraisingEntryTableFragment,
} from "#elements/tables/fundraising/FundraisingEntriesTable";
import { graphql } from "#graphql/index.js";
import { useListQuery } from "#hooks/useListQuery.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const ViewTeamFundraisingDocument = graphql(
  /* GraphQL */ `
    query ViewTeamFundraisingDocument(
      $teamUuid: GlobalId!
      $page: Int
      $pageSize: Int
      $sortBy: [String!]
      $sortDirection: [SortDirection!]
      $dateFilters: [FundraisingEntryResolverKeyedDateFilterItem!]
      $oneOfFilters: [FundraisingEntryResolverKeyedOneOfFilterItem!]
      $stringFilters: [FundraisingEntryResolverKeyedStringFilterItem!]
      $numericFilters: [FundraisingEntryResolverKeyedNumericFilterItem!]
    ) {
      team(uuid: $teamUuid) {
        fundraisingTotalAmount
        solicitationCode {
          id
          name
          prefix
          code
        }
        members {
          id
          person {
            id
            name
            linkblue
          }
        }
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
    }
  `,
  [FundraisingEntryTableFragment]
);

const SolicitationCodesDocument = graphql(/* GraphQL */ `
  query SolicitationCodes {
    solicitationCodes {
      data {
        id
        prefix
        code
        name
      }
    }
  }
`);

const SetTeamSolicitationCodeDocument = graphql(/* GraphQL */ `
  mutation SetTeamSolicitationCode(
    $teamUuid: GlobalId!
    $solCodeId: GlobalId!
  ) {
    assignSolicitationCodeToTeam(
      teamId: $teamUuid
      solicitationCode: $solCodeId
    )
  }
`);

const ClearTeamSolicitationCodeDocument = graphql(/* GraphQL */ `
  mutation ClearTeamSolicitationCode($teamUuid: GlobalId!) {
    removeSolicitationCodeFromTeam(teamId: $teamUuid)
  }
`);

function ViewTeamFundraising() {
  const { teamId: teamUuid } = Route.useParams();
  const [fundraisingTeamSearchEnabled, setFundraisingTeamSearchEnabled] =
    useState(false);

  const canSetSolicitationCode = useAuthorizationRequirement(
    "update",
    "SolicitationCodeNode"
  );

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
    variables: { ...listQuery.queryOptions, teamUuid },
  });
  useQueryStatusWatcher({ fetching, error });

  const [{ data: solicitationCodesData, ...solicitationCodesState }] = useQuery(
    {
      query: SolicitationCodesDocument,
      pause: !fundraisingTeamSearchEnabled,
    }
  );
  useQueryStatusWatcher(solicitationCodesState);

  const [setSolicitationCodeState, setSolicitationCode] = useMutation(
    SetTeamSolicitationCodeDocument
  );
  useQueryStatusWatcher(setSolicitationCodeState);

  const [clearSolicitationCodeState, clearSolicitationCode] = useMutation(
    ClearTeamSolicitationCodeDocument
  );
  useQueryStatusWatcher(clearSolicitationCodeState);

  const [solCodeSearch, setSolCodeSearch] = useState("");
  const solCodeOptions = solicitationCodesData?.solicitationCodes.data.map(
    ({ code, prefix, name, id }) => ({
      label: `${prefix}${code.toString().padStart(4, "0")} - ${name}`,
      value: id,
    })
  );
  const filteredSolCodeOptions = solCodeOptions?.filter(({ label }) =>
    label.toLowerCase().includes(solCodeSearch.toLowerCase())
  );

  if (!canSetSolicitationCode && !data?.team.solicitationCode) {
    return (
      <p>
        Your team has not been assigned any fundraising entries yet. This does
        not mean that your donations have not been recorded, just that they have
        not been fully processed and assigned to you yet.
      </p>
    );
  } else {
    return (
      <Flex vertical>
        <Flex justify="center" style={{ paddingBottom: "1em" }}>
          <Card
            title="Total!!!"
            styles={{
              header: {
                padding: "0.5rem",
                display: "flex",
                justifyContent: "center",
              },
              title: {
                padding: "0.5rem",
                display: "flex",
                justifyContent: "center",
              },
              body: {
                padding: "1rem",
                display: "flex",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: "bold",
              },
            }}
            style={{ width: "100%" }}
          >
            ${(data?.team.fundraisingTotalAmount ?? 0).toFixed(2)}
          </Card>
        </Flex>
        <Form.Item label="Solicitation Code">
          <Space.Compact style={{ width: "100%" }}>
            <AutoComplete
              options={filteredSolCodeOptions}
              showSearch
              onSearch={setSolCodeSearch}
              searchValue={solCodeSearch}
              onDropdownVisibleChange={setFundraisingTeamSearchEnabled}
              onSelect={(value: string) => {
                if (
                  confirm(
                    "Are you sure you want to assign this team to the selected solicitation code?"
                  )
                ) {
                  setSolicitationCode({ teamUuid, solCodeId: value })
                    .catch(() => {
                      alert(
                        "An error occurred while assigning the team to the solicitation code."
                      );
                    })
                    .finally(() => {
                      refreshFundraisingEntries({
                        requestPolicy: "network-only",
                      });
                    });
                }
              }}
              value={
                data?.team.solicitationCode
                  ? `${data.team.solicitationCode.prefix}${data.team.solicitationCode.code
                      .toString()
                      .padStart(4, "0")} - ${data.team.solicitationCode.name}`
                  : undefined
              }
              disabled={data?.team.solicitationCode != null}
            />
            <Button
              danger
              name="clear"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to remove the solicitation code from this team?"
                  )
                ) {
                  clearSolicitationCode({ teamUuid })
                    .catch(() => {
                      alert(
                        "An error occurred while removing the solicitation code from the team."
                      );
                    })
                    .finally(() => {
                      refreshFundraisingEntries({
                        requestPolicy: "network-only",
                      });
                    });
                }
              }}
            >
              Clear
            </Button>
          </Space.Compact>
        </Form.Item>
        <FundraisingEntriesTable
          data={data?.team.fundraisingEntries}
          form={listQuery}
          refresh={() =>
            refreshFundraisingEntries({ requestPolicy: "network-only" })
          }
          loading={fetching}
          potentialAssignees={
            data?.team.members.map(({ person: { id, linkblue, name } }) => ({
              value: id,
              label: name ?? linkblue ?? id,
            })) ?? []
          }
        />
      </Flex>
    );
  }
}

export const Route = createFileRoute("/teams/$teamId/_layout/fundraising")({
  component: ViewTeamFundraising,
});
