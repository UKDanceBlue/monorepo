console.log(
  "This page shows you how to add images on the app! You will add a photo, make sure you have a name for it and a description. "
);
import { PlusOutlined } from "@ant-design/icons";
import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel } from "@ukdanceblue/common";
import { Button, Flex, Typography } from "antd";
import { useState } from "react";

import { CreateImagePopup } from "#elements/components/image/CreateImagePopup.js";
import { ImagesTable } from "#elements/tables/ImagesTable.js";
import { routerAuthCheck } from "#tools/routerAuthCheck.js";

function ListImagesPage() {
  const [createImageOpen, setCreateImageOpen] = useState(false);
  const { _splat } = Route.useParams();

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
      <ImagesTable previewedImageId={_splat} />
    </>
  );
}

export const Route = createFileRoute("/images/$")({
  component: ListImagesPage,
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.CommitteeChairOrCoordinator,
      },
    ],
  },
});
