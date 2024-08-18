import { EyeOutlined, InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { API_BASE_URL } from "@config/api";
import { useAntFeedback } from "@hooks/useAntFeedback";
import { useListQuery } from "@hooks/useListQuery";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { base64StringToArray,SortDirection } from "@ukdanceblue/common";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-portal";
import { Button, Flex, Image, Modal, Table, Typography, Upload } from "antd";
import { useState } from "react";
import { thumbHashToDataURL } from "thumbhash";
import { useQuery } from "urql";

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

const imagesTableQueryDocument = graphql(/* GraphQL */ `
  query ImagesTable(
    $page: Int
    $pageSize: Int
    $sortBy: [String!]
    $sortDirection: [SortDirection!]
    $dateFilters: [ImageResolverKeyedDateFilterItem!]
    $isNullFilters: [ImageResolverKeyedIsNullFilterItem!]
    $oneOfFilters: [ImageResolverKeyedOneOfFilterItem!]
    $stringFilters: [ImageResolverKeyedStringFilterItem!]
    $numericFilters: [ImageResolverKeyedNumericFilterItem!]
  ) {
    images(
      page: $page
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      dateFilters: $dateFilters
      isNullFilters: $isNullFilters
      oneOfFilters: $oneOfFilters
      stringFilters: $stringFilters
      numericFilters: $numericFilters
    ) {
      page
      pageSize
      total
      data {
        ...ImagesTableFragment
      }
    }
  }
`);

export const ImagesTable = () => {
  const { queryOptions, updatePagination, clearSorting, pushSorting } =
    useListQuery(
      {
        initPage: 1,
        initPageSize: 10,
        initSorting: [{ field: "createdAt", direction: SortDirection.desc }],
      },
      {
        allFields: ["alt", "width", "height", "createdAt", "updatedAt"],
        stringFields: ["alt"],
        numericFields: ["width", "height"],
        dateFields: ["createdAt", "updatedAt"],
        oneOfFields: [],
        isNullFields: [],
      }
    );
  const { showErrorMessage } = useAntFeedback();

  const [{ data: imagesDocument, error, fetching }, refresh] = useQuery({
    query: imagesTableQueryDocument,
    variables: queryOptions,
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading images...",
  });

  const listImagesData = getFragmentData(
    ImagesTableFragment,
    imagesDocument?.images.data
  );

  const [previewedImage, setPreviewedImage] = useState<
    Exclude<typeof listImagesData, null | undefined>[number] | null
  >(null);
  const [uploadingImage, setUploadingImage] = useState<
    Exclude<typeof listImagesData, null | undefined>[number] | null
  >(null);

  return (
    <>
      <Modal
        open={previewedImage !== null}
        onCancel={() => setPreviewedImage(null)}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <Typography>{previewedImage?.alt ?? "Image Preview"}</Typography>
        <Image src={previewedImage?.url?.toString()} />
      </Modal>
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
              setTimeout(
                () =>
                  refresh({
                    requestPolicy: "network-only",
                  }),
                1000
              );
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
      <Table
        dataSource={listImagesData ?? undefined}
        rowKey={({ id }) => id}
        loading={fetching}
        pagination={
          imagesDocument
            ? {
                current: imagesDocument.images.page,
                pageSize: imagesDocument.images.pageSize,
                total: imagesDocument.images.total,
                showSizeChanger: true,
              }
            : false
        }
        sortDirections={["ascend", "descend"]}
        onChange={(pagination, _filters, sorter, _extra) => {
          updatePagination({
            page: pagination.current,
            pageSize: pagination.pageSize,
          });
          clearSorting();
          for (const sort of Array.isArray(sorter) ? sorter : [sorter]) {
            if (!sort.order) {
              continue;
            }
            pushSorting({
              field: sort.field as
                | "alt"
                | "width"
                | "height"
                | "createdAt"
                | "updatedAt",
              direction:
                sort.order === "ascend"
                  ? SortDirection.asc
                  : SortDirection.desc,
            });
          }
        }}
        columns={[
          {
            title: "Preview",
            dataIndex: "thumbHash",
            render: (thumbHash: string, row) =>
              thumbHash ? (
                <Button
                  onClick={() => setPreviewedImage(row)}
                  type="text"
                  style={{ padding: 0 }}
                >
                  <img
                    src={thumbHashToDataURL(base64StringToArray(thumbHash))}
                  />
                </Button>
              ) : undefined,
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
          },
          {
            title: "Actions",
            dataIndex: "uuid",
            render: (_, row) => (
              <Flex gap="small" align="center">
                <Button
                  onClick={() => setPreviewedImage(row)}
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
