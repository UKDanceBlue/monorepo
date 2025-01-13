import { BarsOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Button, Input, Select, Table } from "antd";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "urql";

import { useMarathon } from "#config/marathonContext";
import {
  AssignTeamToSolicitationCodeDocument,
  UnassignTeamFromSolicitationCodeDocument,
} from "#documents/solicitationCode.ts";
import { TeamSelectFragment } from "#documents/team.ts";
import { readFragment } from "#gql/index.js";
import { graphql } from "#gql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";

const SolicitationCodeTableFragment = graphql(/* GraphQL */ `
  fragment SolicitationCodeTableFragment on SolicitationCodeNode {
    id
    text
    teams(marathonId: $marathonId) {
      id
      name
    }
  }
`);

const SolicitationCodeTableDocument = graphql(
  /* GraphQL */ `
    query SolicitationCodeTable($marathonId: GlobalId!) {
      solicitationCodes {
        data {
          ...SolicitationCodeTableFragment
        }
      }
    }
  `,
  [SolicitationCodeTableFragment]
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
    SolicitationCodeTableFragment,
    result.data?.solicitationCodes.data ?? []
  );

  const mappedData = useMemo(() => {
    return data.map((solicitationCode) => ({
      text: solicitationCode.text,
      key: solicitationCode.id,
      teams: solicitationCode.teams,
    }));
  }, [data]);

  const filteredData = useMemo(() => {
    return mappedData.filter((solicitationCode) => {
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
  }, [mappedData, solicitationCodeSearch, teamSearch]);

  return (
    <Table
      dataSource={filteredData}
      loading={result.fetching}
      rowKey={(record) => record.key}
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
          title: "Teams",
          dataIndex: "teams",
          key: "teams",
          width: "40%",
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
          width: "10%",
          render: (_, { key }) => (
            <Link
              to="/fundraising/solicitation-code/$solicitationCodeId"
              params={{ solicitationCodeId: key }}
            >
              <Button icon={<BarsOutlined />} />
            </Link>
          ),
        },
      ]}
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
    key: string;
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
          solicitationCodeId: record.key,
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
