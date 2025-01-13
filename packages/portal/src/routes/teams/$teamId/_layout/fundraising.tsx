import { useInvalidate } from "@refinedev/core";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { AutoComplete, Button, Card, Flex, Form, Space } from "antd";
import { useState } from "react";
import { useMutation, useQuery } from "urql";

import { PaginationFragment } from "#documents/shared.ts";
import {
  FundraisingEntriesTable,
  FundraisingEntryTableFragment,
} from "#elements/tables/fundraising/FundraisingEntriesTable";
import { graphql } from "#gql/index.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";
import { useTypedOne } from "#hooks/useTypedRefine.ts";

const TeamFundraisingEntriesDocument = graphql(
  /* GraphQL */ `
    query ViewTeamFundraisingDocument(
      $teamUuid: GlobalId!
      $page: PositiveInt
      $pageSize: NonNegativeInt
      $sortBy: [FundraisingEntryResolverSort!]
      $filter: FundraisingEntryResolverFilterGroup
      $search: FundraisingEntryResolverSearchFilter
    ) {
      team(id: $teamUuid) {
        fundraisingEntries(
          page: $page
          pageSize: $pageSize
          sortBy: $sortBy
          filters: $filter
          search: $search
        ) {
          data {
            ...FundraisingEntryTableFragment
          }
          ...PaginationFragment
        }
      }
    }
  `,
  [FundraisingEntryTableFragment, PaginationFragment]
);

const TeamFundraisingFragment = graphql(
  /* GraphQL */ `
    fragment TeamFundraisingFragment on TeamNode {
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
    }
  `,
  [FundraisingEntryTableFragment, PaginationFragment]
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

  const invalidate = useInvalidate();

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

  const { data } = useTypedOne({
    fragment: TeamFundraisingFragment,
    props: {
      resource: "fundraisingEntry",
      id: useParams({ from: "/teams/$teamId/_layout/fundraising" }).teamId,
    },
  });

  if (!canSetSolicitationCode && !data?.data.solicitationCode) {
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
            ${(data?.data.fundraisingTotalAmount ?? 0).toFixed(2)}
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
                    .finally(() =>
                      invalidate({
                        invalidates: ["all"],
                        resource: "fundraisingEntries",
                      })
                    );
                }
              }}
              value={
                data?.data.solicitationCode
                  ? `${data.data.solicitationCode.prefix}${data.data.solicitationCode.code
                      .toString()
                      .padStart(4, "0")} - ${data.data.solicitationCode.name}`
                  : undefined
              }
              disabled={data?.data.solicitationCode != null}
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
                    .finally(() =>
                      invalidate({
                        invalidates: ["all"],
                        resource: "fundraising",
                      })
                    );
                }
              }}
            >
              Clear
            </Button>
          </Space.Compact>
        </Form.Item>
        <FundraisingEntriesTable
          potentialAssignees={
            data?.data.members.map(({ person: { id, linkblue, name } }) => ({
              value: id,
              label: name ?? linkblue ?? id,
            })) ?? []
          }
          extraMeta={{
            gqlQuery: TeamFundraisingEntriesDocument,
            gqlVariables: {
              teamUuid,
            },
            targetPath: ["team", "fundraisingEntries"],
          }}
        />
      </Flex>
    );
  }
}

export const Route = createFileRoute("/teams/$teamId/_layout/fundraising")({
  component: ViewTeamFundraising,
});
