import { PlusOutlined } from "@ant-design/icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Flex } from "antd";

import { SolicitationCodeTable } from "#elements/tables/fundraising/SolicitationCodeTable";

export const Route = createFileRoute("/fundraising/solicitation-code/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Flex justify="space-between" align="center">
        <h1>Solicitation Codes</h1>
        <Flex gap={16}>
          <Link to="/fundraising/solicitation-code/create">
            <Button icon={<PlusOutlined />} size="large">
              Create Solicitation Code
            </Button>
          </Link>
        </Flex>
      </Flex>
      <SolicitationCodeTable />
    </>
  );
}
