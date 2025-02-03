import { PlusOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "antd";

import { SolicitationCodeTable } from "#elements/tables/fundraising/SolicitationCodeTable";

export const Route = createFileRoute("/fundraising/solicitation-code/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <List
      headerButtons={
        <Link to="/fundraising/solicitation-code/create">
          <Button icon={<PlusOutlined />} size="large">
            Create Solicitation Code
          </Button>
        </Link>
      }
    >
      <SolicitationCodeTable />
    </List>
  );
}
