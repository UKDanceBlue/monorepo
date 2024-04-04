import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import { useState } from "react";

import { CreateImagePopup } from "./CreateImagePopup";
import { ImagesTable } from "./ImagesTable";

export function ListImagesPage() {
  const [createImageOpen, setCreateImageOpen] = useState(false);

  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Title>Images</Typography.Title>
        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={() => setCreateImageOpen(true)}
          size="large"
        >
          Add Image
        </Button>
      </Flex>
      <CreateImagePopup
        open={createImageOpen}
        onClose={(createdImageUuid) => {
          setCreateImageOpen(false);
          if (createdImageUuid) {
            // TODO: Navigate to the created image
          }
        }}
      />
      <ImagesTable />
    </>
  );
}
