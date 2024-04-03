import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useListQuery } from "@hooks/useListQuery";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useNavigate } from "@tanstack/react-router";
import { SortDirection, base64StringToArray } from "@ukdanceblue/common";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { Button, Flex, Image, Modal, Table } from "antd";
import { useState } from "react";
import { thumbHashToDataURL } from "thumbhash";
import { useQuery } from "urql";

const ImagesTableFragment = graphql(/* GraphQL */ `
  fragment ImagesTableFragment on ImageResource {
    uuid
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
  const navigate = useNavigate();

  const { queryOptions, updatePagination, clearSorting, pushSorting } =
    useListQuery(
      {
        initPage: 1,
        initPageSize: 10,
        initSorting: [],
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

  const [{ data: imagesDocument, error, fetching }] = useQuery({
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

  return (
    <>
      <Modal
        open={previewedImage !== null}
        onCancel={() => setPreviewedImage(null)}
      >
        <Image
          width={previewedImage?.width}
          height={previewedImage?.height}
          src={previewedImage?.url?.toString()}
          preview={
            previewedImage?.thumbHash
              ? {
                  src: thumbHashToDataURL(
                    base64StringToArray(previewedImage.thumbHash)
                  ),
                }
              : false
          }
        />
      </Modal>
      <Table
        dataSource={listImagesData ?? undefined}
        rowKey={({ uuid }) => uuid}
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
                  ? SortDirection.ASCENDING
                  : SortDirection.DESCENDING,
            });
          }
        }}
        columns={[
          {
            title: "Alt text",
            dataIndex: "alt",
          },
          {
            title: "Width",
            dataIndex: "width",
          },
          {
            title: "Height",
            dataIndex: "height",
          },
          {
            title: "Created At",
            dataIndex: "createdAt",
          },
          {
            title: "Actions",
            dataIndex: "uuid",
            render: (uuid: string, row) => (
              <Flex gap="small" align="center">
                <Button
                  onClick={() => setPreviewedImage(row)}
                  icon={<EyeOutlined />}
                />
                <Button
                  onClick={() =>
                    navigate({
                      to: "/images/$imageId/edit",
                      params: { imageId: uuid },
                    }).catch((error: unknown) => console.error(error))
                  }
                  icon={<EditOutlined />}
                />
              </Flex>
            ),
          },
        ]}
      />
    </>
  );
};
