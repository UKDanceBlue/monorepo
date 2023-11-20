import { PlusOutlined } from "@ant-design/icons";
import { TeamsTable } from "@elements/tables/TeamsTable";
import { useNavigate } from "@tanstack/react-router";
import { Button, Flex } from "antd";

export function ListTeamsPage() {
  const navigate = useNavigate();

  return (
    <>
      <Flex justify="space-between" align="center">
        <h1>Teams</h1>
        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={() => void navigate({ to: "/teams/create" })}
          size="large"
        >
          Create Team
        </Button>
      </Flex>
      <TeamsTable />
    </>
  );
}
