import { MinusCircleOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Button, Flex, Form, Input } from "antd";
import { useMutation, useQuery } from "urql";

import {
  AssignTeamToSolicitationCodeDocument,
  setSolicitationCodeDocument,
  SetSolicitationCodeFragment,
  solicitationCodeDocument,
  UnassignTeamFromSolicitationCodeDocument,
} from "#documents/solicitationCode.ts";
import { TeamSelect } from "#elements/components/team/TeamSelect";
import {
  FundraisingEntriesTable,
  FundraisingEntryTableFragment,
} from "#elements/tables/fundraising/FundraisingEntriesTable";
import { TeamsTable, TeamsTableFragment } from "#elements/tables/TeamsTable";
import type { ResultOf, VariablesOf } from "#graphql/index";
import { graphql } from "#graphql/index";
import { useAntFeedback, useAskConfirm } from "#hooks/useAntFeedback";
import { useListQuery } from "#hooks/useListQuery";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";

export const Route = createFileRoute(
  "/fundraising/solicitation-code/$solicitationCodeId/"
)({
  component: RouteComponent,
});

const SolicitationCodeDocument = graphql(
  /* GraphQL */ `
    query SolicitationCodeDocument(
      $solicitationCodeId: GlobalId!
      $page: Int
      $pageSize: Int
      $sortBy: [String!]
      $sortDirection: [SortDirection!]
      $dateFilters: [FundraisingEntryResolverKeyedDateFilterItem!]
      $oneOfFilters: [FundraisingEntryResolverKeyedOneOfFilterItem!]
      $stringFilters: [FundraisingEntryResolverKeyedStringFilterItem!]
      $numericFilters: [FundraisingEntryResolverKeyedNumericFilterItem!]
    ) {
      solicitationCode(id: $solicitationCodeId) {
        prefix
        code
        name
        text
        ...SetSolicitationCode
        teams {
          ...TeamsTableFragment
          members {
            id
            person {
              id
              name
              linkblue
              email
            }
          }
        }
        entries(
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
  [
    TeamsTableFragment,
    FundraisingEntryTableFragment,
    SetSolicitationCodeFragment,
  ]
);

function RouteComponent() {
  const { showErrorMessage } = useAntFeedback();
  const { solicitationCodeId } = useParams({
    from: "/fundraising/solicitation-code/$solicitationCodeId/",
  });

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

  const { formProps } = useForm<
    ResultOf<typeof solicitationCodeDocument>,
    HttpError,
    VariablesOf<typeof setSolicitationCodeDocument>["input"],
    ResultOf<typeof SetSolicitationCodeFragment>
  >({
    resource: "solicitationCode",
    meta: {
      gqlMutation: setSolicitationCodeDocument,
      gqlQuery: solicitationCodeDocument,
    },
    action: "edit",
    id: solicitationCodeId,
  });

  const [result, refresh] = useQuery({
    query: SolicitationCodeDocument,
    variables: {
      solicitationCodeId,
      ...listQuery.queryOptions,
    },
  });
  useQueryStatusWatcher(result);

  const [assignTeamToSolicitationCodeStatus, assignTeamToSolicitationCode] =
    useMutation(AssignTeamToSolicitationCodeDocument);
  useQueryStatusWatcher(assignTeamToSolicitationCodeStatus);

  const [
    unassignTeamFromSolicitationCodeStatus,
    unassignTeamFromSolicitationCode,
  ] = useMutation(UnassignTeamFromSolicitationCodeDocument);
  useQueryStatusWatcher(unassignTeamFromSolicitationCodeStatus);

  const { openConfirmModal: openConfirmAssignModal } = useAskConfirm({
    modalContent:
      "Are you sure you want to assign this team to the solicitation code?",
    onOk: async (id: string) => {
      await assignTeamToSolicitationCode({
        teamId: id,
        solicitationCodeId,
      });
      refresh({ requestPolicy: "network-only" });
    },
  });

  const { openConfirmModal: openConfirmUnassignModal } = useAskConfirm({
    modalContent:
      "Are you sure you want to unassign this team from the solicitation code?",
    onOk: async (id: string) => {
      await unassignTeamFromSolicitationCode({
        teamId: id,
      });
      refresh({ requestPolicy: "network-only" });
    },
  });

  return (
    <>
      <Flex justify="space-between" align="center">
        <h1>Solicitation Code {result.data?.solicitationCode.text}</h1>
        <Flex justify="flex-end" align="flex-end" vertical>
          <Form
            {...formProps}
            layout="inline"
            onFinish={(data) =>
              formProps.onFinish?.({ ...data, name: data.name || undefined })
            }
          >
            <Form.Item label="Name" name="name" style={{ maxWidth: "35ch" }}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
          <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
            Note that this name will be overridden any time a DDN is uploaded
          </p>
        </Flex>
      </Flex>
      <Flex vertical gap="1rem">
        <div>
          <Flex justify="space-between" align="center">
            <h2>Teams</h2>
            <TeamSelect
              placeholder="Assign a team to this solicitation code"
              onSelect={async ({ id }) => {
                await openConfirmAssignModal(id).catch((error: unknown) => {
                  console.error(error);
                  showErrorMessage(
                    `Failed to assign team to solicitation code\n${String(
                      error
                    )}`
                  );
                });
              }}
            />
          </Flex>
          <TeamsTable
            dataFragment={result.data?.solicitationCode.teams}
            loading={result.fetching}
            additionalActions={[
              {
                key: "unassign",
                icon: <MinusCircleOutlined />,
                onClick: (record) => {
                  openConfirmUnassignModal(record.id).catch(
                    (error: unknown) => {
                      console.error(error);
                      showErrorMessage(
                        `Failed to unassign team from solicitation code\n${String(
                          error
                        )}`
                      );
                    }
                  );
                },
              },
            ]}
          />
        </div>
        <div>
          <Flex justify="space-between" align="center">
            <h2>Entries</h2>
          </Flex>
          <FundraisingEntriesTable
            data={result.data?.solicitationCode.entries}
            form={listQuery}
            refresh={() => refresh({ requestPolicy: "network-only" })}
            loading={result.fetching}
            potentialAssignees={result.data?.solicitationCode.teams.reduce<
              { value: string; label: string }[]
            >((acc, team) => {
              acc.push(
                ...team.members.map(({ person }) => ({
                  value: person.id,
                  label: person.name ?? person.linkblue ?? person.email,
                }))
              );
              return acc;
            }, [])}
          />
        </div>
      </Flex>
    </>
  );
}
