import { BarsOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Button, Input, Table } from "antd";
import { useMemo, useState } from "react";
import { useQuery } from "urql";

import { useMarathon } from "#config/marathonContext";
import { readFragment } from "#graphql/index";
import { graphql } from "#graphql/index";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";

const SolicitationCodeTableFragment = graphql(/* GraphQL */ `
  fragment SolicitationCodeTableFragment on SolicitationCodeNode {
    id
    text
    teams(marathonId: $marathonId) {
      name
    }
  }
`);

const SolicitationCodeTableDocument = graphql(
  /* GraphQL */ `
    query SolicitationCodeTable($marathonId: GlobalId!) {
      solicitationCodes {
        ...SolicitationCodeTableFragment
      }
    }
  `,
  [SolicitationCodeTableFragment]
);

export function SolicitationCodeTable() {
  const { id: marathonId } = useMarathon() ?? {};

  const [result] = useQuery({
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
    result.data?.solicitationCodes ?? []
  );

  const mappedData = useMemo(() => {
    return data.map((solicitationCode) => ({
      text: solicitationCode.text,
      key: solicitationCode.id,
      teams: solicitationCode.teams.map((team) => team.name).join(", "),
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
        !solicitationCode.teams.toLowerCase().includes(teamSearch.toLowerCase())
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
