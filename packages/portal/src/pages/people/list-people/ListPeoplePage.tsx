import { PlusOutlined } from "@ant-design/icons";
import { PeopleTable } from "@elements/tables/PeopleTable";
import { Button, Flex, Typography } from "antd";

export function ListPeoplePage() {
  // const navigate = useNavigate();
  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Title>People</Typography.Title>
        <Button
          type="link"
          icon={<PlusOutlined />}
          // onClick={() => void navigate({ to: "/events/create" })}
          size="large"
        >
          Add Person
        </Button>
      </Flex>
      <PeopleTable />
    </>
  );
}
