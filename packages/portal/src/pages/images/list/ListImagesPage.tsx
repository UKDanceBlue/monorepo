import { useNavigate } from "@tanstack/react-router";
import { Flex, Typography } from "antd";
import { useState } from "react";

import { CreateImagePopup } from "./CreateImagePopup";
import { ImagesTable } from "./ImagesTable";

export function ListImagesPage() {
  const navigate = useNavigate();

  const [createImageOpen, setCreateImageOpen] = useState(false);
  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Title>Images</Typography.Title>
      </Flex>
      <CreateImagePopup
        open={createImageOpen}
        onClose={(createdImageUuid) => {
          setCreateImageOpen(false);
          if (createdImageUuid) {
            alert(`Created image with UUID: ${createdImageUuid}`);
          }
        }}
      />
      <ImagesTable />
    </>
  );
}
