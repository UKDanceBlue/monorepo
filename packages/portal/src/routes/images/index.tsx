import { PlusOutlined } from "@ant-design/icons";
import { EyeOutlined, InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { getDefaultSortOrder, List } from "@refinedev/antd";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { base64StringToArray } from "@ukdanceblue/common";
import { Button, Flex, Image, Modal, Table, Typography, Upload } from "antd";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { thumbHashToDataURL } from "thumbhash";

import { API_BASE_URL } from "#config/api.js";
import { CreateImagePopup } from "#elements/components/image/CreateImagePopup.js";
import { RefineSearchForm } from "#elements/components/RefineSearchForm.js";
import { graphql } from "#gql/index.js";
import { useAntFeedback } from "#hooks/useAntFeedback.js";
import { useTypedTable } from "#hooks/useTypedRefine.js";

import { imageIconDataUrl } from "../../elements/imageIconDataUrl.js";

const ImagesTableFragment = graphql(/* GraphQL */ `
  fragment ImagesTableFragment on ImageNode {
    id
    url
    thumbHash
    height
    width
    alt
    mimeType
    createdAt
  }
`);

export const Route = createFileRoute("/images/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [createImageOpen, setCreateImageOpen] = useState(false);
  const navigate = useNavigate();
  const { showErrorMessage } = useAntFeedback();

  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  const {
    searchFormProps,
    tableProps,
    tableQuery: { refetch },
    pageSize,
    current,
    sorters,
    setCurrent,
  } = useTypedTable({
    fragment: ImagesTableFragment,
    props: {
      resource: "image",
      sorters: {
        initial: [
          {
            field: "createdAt",
            order: "desc",
          },
        ],
      },
    },
    fieldTypes: {
      createdAt: "date",
    },
  });

  useEffect(() => {
    function setIdxTo(offset: -1 | 1) {
      const min = pageSize * (current - 1);
      const max = pageSize * current;
      setPreviewIdx((prev) => {
        const idx = (prev ?? min) + offset;
        if (idx < min || idx >= max) {
          setCurrent(Math.floor(idx / pageSize) + 1);
        }
        return idx;
      });
    }

    const listener = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setIdxTo(-1);
      } else if (e.key === "ArrowRight") {
        setIdxTo(1);
      }
    };

    document.addEventListener("keydown", listener);

    return () => document.removeEventListener("keydown", listener);
  }, [current, pageSize, setCurrent]);

  const [uploadingImage, setUploadingImage] = useState<
    NonNullable<(typeof tableProps)["dataSource"]>[number] | null
  >(null);

  return (
    <List
      headerButtons={
        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={() => setCreateImageOpen(true)}
        >
          Add Image
        </Button>
      }
    >
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
      <Modal
        open={uploadingImage !== null}
        onCancel={() => setUploadingImage(null)}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <Typography.Title level={3}>Upload Image</Typography.Title>
        <Upload.Dragger
          accept="image/*"
          action={new URL(
            `/api/upload/image/${uploadingImage?.id}`,
            API_BASE_URL
          ).toString()}
          maxCount={1}
          onChange={(info) => {
            if (info.file.status === "done") {
              setTimeout(() => refetch(), 1000);
              setUploadingImage(null);
            }
            if (info.file.status === "error") {
              void showErrorMessage(String(info.file.error));
            }
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Upload.Dragger>
      </Modal>
      <RefineSearchForm searchFormProps={searchFormProps} />

      <Table
        {...tableProps}
        rowKey="id"
        columns={[
          {
            title: "Preview",
            dataIndex: "thumbHash",
            render: (_, row, idx) => (
              <Image
                width={50}
                src={
                  row.thumbHash
                    ? thumbHashToDataURL(base64StringToArray(row.thumbHash))
                    : imageIconDataUrl
                }
                preview={{
                  visible:
                    previewIdx != null &&
                    previewIdx - pageSize * (current - 1) === idx,
                  onVisibleChange: (visible) =>
                    setPreviewIdx(
                      visible ? pageSize * (current - 1) + idx : null
                    ),
                  src: row.url?.toString(),
                  title: (
                    <Typography.Title>
                      {row.alt ?? "Image Preview"}
                    </Typography.Title>
                  ),
                }}
              />
            ),
            width: 1,
          },
          {
            title: "Alt text",
            dataIndex: "alt",
            sorter: true,
          },
          {
            title: "Width",
            dataIndex: "width",
            sorter: true,
          },
          {
            title: "Height",
            dataIndex: "height",
            sorter: true,
          },
          {
            title: "Created At",
            dataIndex: "createdAt",
            sorter: true,
            render: (date: string) =>
              DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED),
            defaultSortOrder: getDefaultSortOrder("createdAt", sorters),
          },
          {
            title: "Actions",
            dataIndex: "id",
            render: (_, row, idx) => (
              <Flex gap="small" align="center">
                <Button
                  onClick={() => setPreviewIdx(pageSize * (current - 1) + idx)}
                  icon={<EyeOutlined />}
                />
                <Button
                  onClick={() => setUploadingImage(row)}
                  icon={<UploadOutlined />}
                />
              </Flex>
            ),
          },
        ]}
      />
    </List>
  );
}
