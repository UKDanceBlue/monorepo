import { BarsOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Button, Table } from "antd";
import { useQuery } from "urql";

import { useMarathon } from "#config/marathonContext";
import { getFragmentData } from "#graphql/fragment-masking";
import { graphql } from "#graphql/gql";
import type { SolicitationCodeTableFragmentFragment } from "#graphql/graphql";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";

const SolicitationCodeTableDocument = graphql(/* GraphQL */ `
  query SolicitationCodeTable($marathonId: GlobalId!) {
    solicitationCodes {
      ...SolicitationCodeTableFragment
    }
  }
`);

const SolicitationCodeTableFragment = graphql(/* GraphQL */ `
  fragment SolicitationCodeTableFragment on SolicitationCodeNode {
    id
    text
    prefix
    code
    teams(marathonId: $marathonId) {
      name
    }
  }
`);

export function SolicitationCodeTable() {
  const { id: marathonId } = useMarathon() ?? {};

  const [result] = useQuery({
    query: SolicitationCodeTableDocument,
    variables: { marathonId: marathonId ?? "" },
    pause: !marathonId,
  });
  useQueryStatusWatcher(result);

  const data = getFragmentData(
    SolicitationCodeTableFragment,
    result.data?.solicitationCodes
  );

  return (
    <Table
      dataSource={data ?? undefined}
      columns={[
        {
          title: "Solicitation Code",
          dataIndex: "text",
          key: "text",
        },
        {
          title: "Teams",
          dataIndex: "teams",
          key: "teams",
          render: (teams: { name: string }[]) =>
            teams.map((team) => team.name).join(", "),
        },
        {
          title: "Actions",
          key: "actions",
          render: ({ code, prefix }: SolicitationCodeTableFragmentFragment) => (
            <Link
              to="/fundraising"
              search={{
                solicitationCodeSearch: `${prefix}${code.toString().padStart(4, "0")}`,
              }}
            >
              <Button icon={<BarsOutlined />} />
            </Link>
          ),
        },
      ]}
    />
  );
}
