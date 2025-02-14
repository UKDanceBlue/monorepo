import { BarsOutlined, SearchOutlined } from "@ant-design/icons";
import { type HttpError, useUpdate } from "@refinedev/core";
import { Link } from "@tanstack/react-router";
import {
  SolicitationCodeTag,
  stringifySolicitationCodeTag,
} from "@ukdanceblue/common";
import { Button, Input, Select, Table } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "urql";

import { useMarathon } from "#config/marathonContext";
import { refineResourceNames } from "#config/refine/resources.tsx";
import {
  AssignTeamToSolicitationCodeDocument,
  UnassignTeamFromSolicitationCodeDocument,
} from "#documents/solicitationCode.js";
import { TeamSelectFragment } from "#documents/team.js";
import { readFragment, type ResultOf, type VariablesOf } from "#gql/index.js";
import { graphql } from "#gql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";

const SolicitationCodeTableFragment = graphql(/* GraphQL */ `
  fragment SolicitationCodeTableFragment on SolicitationCodeNode {
    id
    name
    text
    tags
  }
`);

const SolicitationCodeTableFragmentWithTeams = graphql(/* GraphQL */ `
  fragment SolicitationCodeTableFragmentWithTeams on SolicitationCodeNode {
    id
    name
    text
    tags
    teams(marathonId: $marathonId) {
      id
      name
    }
  }
`);

const SetSolicitationCodeDocument = graphql(
  /* GraphQL */ `
    mutation SetSolicitationCode(
      $input: SetSolicitationCodeInput!
      $id: GlobalId!
    ) {
      setSolicitationCode(id: $id, input: $input) {
        ...SolicitationCodeTableFragment
      }
    }
  `,
  [SolicitationCodeTableFragment]
);

const SolicitationCodeTableDocument = graphql(
  /* GraphQL */ `
    query SolicitationCodeTable($marathonId: GlobalId!) {
      solicitationCodes(sendAll: true) {
        data {
          ...SolicitationCodeTableFragmentWithTeams
        }
      }
    }
  `,
  [SolicitationCodeTableFragmentWithTeams]
);

const SearchTeamsDocument = graphql(
  /* GraphQL */ `
    query SearchTeams($search: String!, $marathonYear: String!) {
      teams(
        filters: {
          operator: AND
          filters: [
            {
              field: name
              filter: {
                singleStringFilter: {
                  comparison: INSENSITIVE_CONTAINS
                  value: $search
                }
              }
            }
            {
              field: marathonYear
              filter: {
                singleStringFilter: { comparison: EQUALS, value: $marathonYear }
              }
            }
          ]
        }
        sendAll: true
      ) {
        data {
          ...TeamSelect
        }
      }
    }
  `,
  [TeamSelectFragment]
);

export function SolicitationCodeTable() {
  const { id: marathonId, year: marathonYear } = useMarathon() ?? {};

  const [result, refetch] = useQuery({
    query: SolicitationCodeTableDocument,
    variables: { marathonId: marathonId ?? "" },
    pause: !marathonId,
  });
  useQueryStatusWatcher(result);

  const [solicitationCodeSearch, setSolicitationCodeSearch] = useState<
    string | undefined
  >();
  const [teamSearch, setTeamSearch] = useState<string | undefined>();

  const data = readFragment(
    SolicitationCodeTableFragmentWithTeams,
    result.data?.solicitationCodes.data ?? []
  );

  const filteredData = useMemo(() => {
    return data.filter((solicitationCode) => {
      if (
        solicitationCodeSearch &&
        !solicitationCode.text
          .toLowerCase()
          .includes(solicitationCodeSearch.toLowerCase())
      ) {
        return false;
      }
      if (
        teamSearch &&
        !solicitationCode.teams
          .map((team) => team.name)
          .join(", ")
          .toLowerCase()
          .includes(teamSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [data, solicitationCodeSearch, teamSearch]);

  return (
    <Table
      dataSource={filteredData}
      loading={result.fetching}
      rowKey="id"
      pagination={false}
      columns={[
        {
          title: "Solicitation Code",
          dataIndex: "text",
          key: "text",
          width: "50%",
          filterDropdown: () => (
            <Input
              placeholder="Search"
              onChange={(e) =>
                setSolicitationCodeSearch(e.target.value || undefined)
              }
            />
          ),
          filteredValue: solicitationCodeSearch
            ? [solicitationCodeSearch]
            : undefined,
          filtered: !!solicitationCodeSearch,
          filterIcon: (
            <SearchOutlined
              color={solicitationCodeSearch ? "blue" : undefined}
            />
          ),
        },
        {
          title: "Tags",
          dataIndex: "tags",
          key: "tags",
          width: "25%",
          render(_, record) {
            return <TagSelect solicitationCode={record} />;
          },
        },
        {
          title: "Teams",
          dataIndex: "teams",
          key: "teams",
          width: "25%",
          filterDropdown: () => (
            <Input
              placeholder="Search"
              onChange={(e) => setTeamSearch(e.target.value || undefined)}
            />
          ),
          filteredValue: teamSearch ? [teamSearch] : undefined,
          filtered: !!teamSearch,
          filterIcon: (
            <SearchOutlined color={teamSearch ? "blue" : undefined} />
          ),
          render(_, record) {
            return (
              <TeamSelect
                marathonYear={marathonYear}
                record={record}
                loading={result.fetching}
                refetch={() => refetch({ requestPolicy: "network-only" })}
              />
            );
          },
        },
        {
          title: "Actions",
          key: "actions",
          render: (_, { id }) => (
            <Link
              to="/fundraising/solicitation-code/$solicitationCodeId"
              params={{ solicitationCodeId: id }}
            >
              <Button icon={<BarsOutlined />} />
            </Link>
          ),
        },
      ]}
    />
  );
}

function TagSelect({
  solicitationCode,
}: {
  solicitationCode: ResultOf<typeof SolicitationCodeTableFragment>;
}) {
  const { mutateAsync } = useUpdate<
    ResultOf<typeof SolicitationCodeTableFragment>,
    HttpError,
    VariablesOf<typeof SetSolicitationCodeDocument>["input"]
  >({
    id: solicitationCode.id,
    resource: refineResourceNames.solicitationCode,
    meta: {
      gqlMutation: SetSolicitationCodeDocument,
    },
  });

  return (
    <Select
      onChange={(vals: SolicitationCodeTag[]) => {
        console.log(vals);
        mutateAsync({
          values: {
            name: solicitationCode.name,
            tags: vals,
          },
        }).catch(console.error);
      }}
      mode="tags"
      options={Object.values(SolicitationCodeTag).map(
        (value): DefaultOptionType => ({
          value,
          label: stringifySolicitationCodeTag(value),
        })
      )}
      style={{
        width: "100%",
      }}
    />
  );
}

function TeamSelect({
  marathonYear,
  record,
  loading,
  refetch,
}: {
  marathonYear?: string;
  record: {
    text: string;
    id: string;
    teams: {
      id: string;
      name: string;
    }[];
  };
  loading: boolean;
  refetch: () => void;
}) {
  const [assignTeamToSolicitationCodeStatus, assignTeamToSolicitationCode] =
    useMutation(AssignTeamToSolicitationCodeDocument);
  useQueryStatusWatcher(assignTeamToSolicitationCodeStatus);

  const [
    unassignTeamFromSolicitationCodeStatus,
    unassignTeamFromSolicitationCode,
  ] = useMutation(UnassignTeamFromSolicitationCodeDocument);
  useQueryStatusWatcher(unassignTeamFromSolicitationCodeStatus);

  const [assignToTeamSearch, setAssignToTeamSearch] = useState<string>("");
  const [searchTeamsDocumentResult] = useQuery({
    query: SearchTeamsDocument,
    variables: {
      search: assignToTeamSearch,
      marathonYear: marathonYear ?? "",
    },
    pause: assignToTeamSearch.length < 3 || !marathonYear,
  });
  useQueryStatusWatcher(searchTeamsDocumentResult);

  const teamOptions = useMemo(
    () =>
      readFragment(
        TeamSelectFragment,
        searchTeamsDocumentResult.data?.teams.data ?? []
      ).map((value) => [value.id, value.name]),
    [searchTeamsDocumentResult]
  );
  const selectedTeams = useMemo(
    () => record.teams.map((value) => [value.id, value.name]),
    [record]
  );

  const options = useMemo(
    () =>
      Object.entries(
        Object.fromEntries([...teamOptions, ...selectedTeams]) as Record<
          string,
          string
        >
      ).map(([id, value]) => ({ label: value, value: id })),
    [teamOptions, selectedTeams]
  );

  return (
    <Select
      style={{ width: "100%" }}
      options={options}
      showSearch
      onSearch={setAssignToTeamSearch}
      filterOption={false}
      onSelect={(value) => {
        assignTeamToSolicitationCode({
          solicitationCodeId: record.id,
          teamId: value,
        })
          .then(() => refetch())
          .catch(console.error);
      }}
      onDeselect={(value) => {
        unassignTeamFromSolicitationCode({
          teamId: value,
        })
          .then(() => refetch())
          .catch(console.error);
      }}
      value={record.teams.map((value) => value.id)}
      mode="multiple"
      loading={
        searchTeamsDocumentResult.fetching ||
        assignTeamToSolicitationCodeStatus.fetching ||
        unassignTeamFromSolicitationCodeStatus.fetching ||
        loading
      }
    />
  );
}
