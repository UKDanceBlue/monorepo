import { PlusOutlined } from "@ant-design/icons";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Flex, Typography } from "antd";
import { useState } from "react";

import { CreateImagePopup } from "#elements/components/image/CreateImagePopup.js";
import { ImagesTable } from "#elements/tables/ImagesTable.js";

function ListImagesPage() {
  const [createImageOpen, setCreateImageOpen] = useState(false);
  const { imageId } = Route.useParams();
  const navigate = useNavigate();

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
            navigate({
              to: "/images/$imageId",
              params: { imageId: createdImageUuid },
            }).catch(console.error);
          }
        }}
      />
      <ImagesTable previewedImageId={imageId} />
    </>
  );
}

export const Route = createFileRoute("/images/$imageId")({
  component: ListImagesPage,
});
