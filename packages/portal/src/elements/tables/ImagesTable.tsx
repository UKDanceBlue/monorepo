import { EyeOutlined, InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { base64StringToArray } from "@ukdanceblue/common";
import { Button, Flex, Image, Modal, Table, Typography, Upload } from "antd";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { thumbHashToDataURL } from "thumbhash";

import { API_BASE_URL } from "#config/api.js";
import { RefineSearchForm } from "#elements/components/RefineSearchForm.tsx";
import { graphql } from "#gql/index.js";
import { useAntFeedback } from "#hooks/useAntFeedback.js";
import { useTypedTable } from "#hooks/useTypedRefine.ts";

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

const imageIconDataUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' focusable='false' data-icon='file-image' width='1em' height='1em' fill='currentColor' aria-hidden='true'%3E%3Cpath d='M854.6 288.7L639.4 73.4c-6-6-14.2-9.4-22.7-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.6-9.4-22.6zM400 402c22.1 0 40 17.9 40 40s-17.9 40-40 40-40-17.9-40-40 17.9-40 40-40zm296 294H328c-6.7 0-10.4-7.7-6.3-12.9l99.8-127.2a8 8 0 0112.6 0l41.1 52.4 77.8-99.2a8 8 0 0112.6 0l136.5 174c4.3 5.2.5 12.9-6.1 12.9zm-94-370V137.8L790.2 326H602z'%3E%3C/path%3E%3C/svg%3E`;

export const ImagesTable = () => {
  const { showErrorMessage } = useAntFeedback();

  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  const {
    searchFormProps,
    tableProps,
    tableQuery: { refetch },
    pageSize,
    current,
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
    function setIdxTo(offset: number) {
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
    <>
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
    </>
  );
};
