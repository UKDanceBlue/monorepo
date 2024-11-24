import { MinusCircleOutlined } from "@ant-design/icons";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { AccessLevel, CommitteeIdentifier } from "@ukdanceblue/common";
import { Flex } from "antd";
import { useMutation, useQuery } from "urql";

import { TeamSelect } from "@/elements/components/team/TeamSelect";
import { FundraisingEntriesTable } from "@/elements/tables/fundraising/FundraisingEntriesTable";
import { TeamsTable } from "@/elements/tables/TeamsTable";
import { graphql } from "@/graphql/gql";
import { useAntFeedback, useAskConfirm } from "@/hooks/useAntFeedback";
import { useListQuery } from "@/hooks/useListQuery";
import { useQueryStatusWatcher } from "@/hooks/useQueryStatusWatcher";
import { routerAuthCheck } from "@/tools/routerAuthCheck";

export const Route = createFileRoute(
  "/fundraising/solicitation-code/$solicitationCodeId/"
)({
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

const SolicitationCodeDocument = graphql(/* GraphQL */ `
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
      teams {
        ...TeamsTableFragment
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
`);

const AssignTeamToSolicitationCodeDocument = graphql(/* GraphQL */ `
  mutation AssignTeamToSolicitationCodeDocument(
    $teamId: GlobalId!
    $solicitationCodeId: GlobalId!
  ) {
    assignSolicitationCodeToTeam(
      teamId: $teamId
      solicitationCode: $solicitationCodeId
    )
  }
`);

const UnassignTeamFromSolicitationCodeDocument = graphql(/* GraphQL */ `
  mutation UnassignTeamFromSolicitationCodeDocument($teamId: GlobalId!) {
    removeSolicitationCodeFromTeam(teamId: $teamId)
  }
`);

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
          />
        </div>
      </Flex>
    </>
  );
}
