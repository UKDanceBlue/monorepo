import {
  DollarOutlined,
  EditOutlined,
  EyeOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { type HttpError, useInvalidate } from "@refinedev/core";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  TeamLegacyStatus,
  TeamLegacyStatusValues,
  TeamTypeValues,
} from "@ukdanceblue/common";
import { Button, Flex, Form, Input, Table } from "antd";
import { useMutation } from "urql";

import { PaginationFragment } from "#documents/shared.ts";
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
import type { ResultOf, VariablesOf } from "#gql/index.js";
import { graphql, readFragment } from "#gql/index.js";
import { useAntFeedback, useAskConfirm } from "#hooks/useAntFeedback";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";
import { useTypedOne } from "#hooks/useTypedRefine.ts";

export const Route = createFileRoute(
  "/fundraising/solicitation-code/$solicitationCodeId/"
)({
  component: RouteComponent,
});

export const TeamsTableFragment = graphql(/* GraphQL */ `
  fragment TeamsTableFragment on TeamNode {
    id
    type
    name
    legacyStatus
    totalPoints
  }
`);

const SolicitationCodePageFragment = graphql(
  /* GraphQL */ `
    fragment SolicitationCodePage on SolicitationCodeNode {
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
    }
  `,
  [TeamsTableFragment, SetSolicitationCodeFragment]
);

const SolicitationCodeFundraisingEntryDocument = graphql(
  /* GraphQL */ `
    query SolicitationCodeFundraisingEntryDocument(
      $solicitationCodeId: GlobalId!
      $page: PositiveInt!
      $pageSize: NonNegativeInt!
      $sortBy: [FundraisingEntryResolverSort!]
      $filters: FundraisingEntryResolverFilterGroup
      $search: FundraisingEntryResolverSearchFilter
    ) {
      solicitationCode(id: $solicitationCodeId) {
        entries(
          page: $page
          pageSize: $pageSize
          sortBy: $sortBy
          filters: $filters
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

function RouteComponent() {
  const { showErrorMessage } = useAntFeedback();
  const { solicitationCodeId } = useParams({
    from: "/fundraising/solicitation-code/$solicitationCodeId/",
  });

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

  const { data } = useTypedOne({
    fragment: SolicitationCodePageFragment,
    props: {
      resource: "solicitationCode",
      id: solicitationCodeId,
    },
  });
  const invalidate = useInvalidate();

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
      await invalidate({
        invalidates: ["detail"],
        resource: "solicitationCode",
        id: solicitationCodeId,
      });
    },
  });

  const { openConfirmModal: openConfirmUnassignModal } = useAskConfirm({
    modalContent:
      "Are you sure you want to unassign this team from the solicitation code?",
    onOk: async (id: string) => {
      await unassignTeamFromSolicitationCode({
        teamId: id,
      });
      await invalidate({
        invalidates: ["detail"],
        resource: "solicitationCode",
        id: solicitationCodeId,
      });
    },
  });

  return (
    <>
      <Flex justify="space-between" align="center">
        <h1>Solicitation Code {data?.data.text}</h1>
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
          <Table
            dataSource={readFragment(
              TeamsTableFragment,
              data?.data.teams ?? []
            )}
            columns={[
              {
                title: "Name",
                dataIndex: "name",
                sorter: true,
              },
              {
                title: "Type",
                dataIndex: "type",
                sorter: true,
                filters: TeamTypeValues.map((key) => ({
                  text: key,
                  value: key,
                })),
              },
              {
                title: "Legacy Status",
                dataIndex: "legacyStatus",
                sorter: true,
                filters: TeamLegacyStatusValues.map((value) => {
                  let text: string;
                  switch (value) {
                    case TeamLegacyStatus.NewTeam: {
                      text = "New Team";
                      break;
                    }
                    case TeamLegacyStatus.ReturningTeam: {
                      text = "Returning Team";
                      break;
                    }
                    case TeamLegacyStatus.DemoTeam: {
                      text = "Demo Team";
                      break;
                    }
                    default: {
                      value satisfies never;
                      text = String(value);
                      break;
                    }
                  }
                  return {
                    text,
                    value,
                  };
                }),
                render: (value) => {
                  switch (value) {
                    case "NewTeam": {
                      return "New Team";
                    }
                    case "ReturningTeam": {
                      return "Returning Team";
                    }
                    default: {
                      return String(value);
                    }
                  }
                },
              },
              {
                title: "Total Points",
                dataIndex: "totalPoints",
                sorter: true,
              },
              {
                title: "Actions",
                key: "actions",
                render: (_text, record) => (
                  <Flex gap="small" align="center">
                    <Link
                      to="/teams/$teamId/points"
                      params={{ teamId: record.id }}
                    >
                      <Button icon={<EyeOutlined />} />
                    </Link>
                    <Link
                      to="/teams/$teamId/fundraising"
                      params={{ teamId: record.id }}
                    >
                      <Button icon={<DollarOutlined />} />
                    </Link>
                    <Link
                      to="/teams/$teamId/edit"
                      params={{ teamId: record.id }}
                    >
                      <Button icon={<EditOutlined />} />
                    </Link>
                    <Button
                      icon={<MinusCircleOutlined />}
                      onClick={() => {
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
                      }}
                    />
                  </Flex>
                ),
              },
            ]}
          />
        </div>
        <div>
          <Flex justify="space-between" align="center">
            <h2>Entries</h2>
          </Flex>
          <FundraisingEntriesTable
            potentialAssignees={data?.data.teams.reduce<
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
            extraMeta={{
              gqlQuery: SolicitationCodeFundraisingEntryDocument,
              gqlVariables: {
                solicitationCodeId,
              },
              targetPath: ["solicitationCode", "entries"],
            }}
          />
        </div>
      </Flex>
    </>
  );
}
