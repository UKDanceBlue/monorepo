import { PlusOutlined } from "@ant-design/icons";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Button, Flex, Typography } from "antd";
import { useState } from "react";

import { CreateImagePopup } from "#elements/components/image/CreateImagePopup.js";
import { ImagesTable } from "#elements/tables/ImagesTable.js";

export const Route = createFileRoute("/images/")({
  component: RouteComponent,
  validateSearch(search) {
    return "previewedImage" in search &&
      typeof search.previewedImage === "string"
      ? { imageId: search.previewedImage }
      : {};
  },
});

function RouteComponent() {
  const [createImageOpen, setCreateImageOpen] = useState(false);
  const navigate = useNavigate();

  const { imageId } = useSearch({ from: "/images/" });

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
              to: "/images",
              search: { imageId: createdImageUuid },
            }).catch(console.error);
          }
        }}
      />
      <ImagesTable previewedImageId={imageId} />
    </>
  );
}
