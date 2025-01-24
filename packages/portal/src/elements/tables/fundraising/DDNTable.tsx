import { EyeOutlined } from "@ant-design/icons";
import { getDefaultSortOrder, useTable } from "@refinedev/antd";
import { Link } from "@tanstack/react-router";
import type { SolicitationCodeNode } from "@ukdanceblue/common";
import { BatchType } from "@ukdanceblue/common";
import { stringifyDDNBatchType } from "@ukdanceblue/common";
import { Button, Flex, Table } from "antd";

import { RefineSearchForm } from "#elements/components/RefineSearchForm.tsx";
import { graphql, type ResultOf } from "#gql/index.js";

const DDNsTableFragment = graphql(/* GraphQL */ `
  fragment DDNsTableFragment on DailyDepartmentNotificationNode {
    id
    combinedDonorName
    comment
    combinedAmount
    solicitationCode {
      prefix
      code
      name
    }
    batch {
      id
      batchType
      batchNumber
    }
  }
`);

export const DDNTable = () => {
  const { searchFormProps, tableProps, sorters } = useTable<
    ResultOf<typeof DDNsTableFragment>
  >({
    meta: {
      gqlFragment: DDNsTableFragment,
      fieldTypes: {
        createdAt: "date",
      },
    },
    syncWithLocation: true,
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
  });

  return (
    <>
      <RefineSearchForm searchFormProps={searchFormProps} />
      <Table
        {...tableProps}
        rowKey="id"
        columns={[
          {
            title: "Donor",
            dataIndex: "combinedDonorName",
            sorter: true,
          },
          {
            title: "Amount",
            dataIndex: "combinedAmount",
            sorter: true,
          },
          {
            title: "Comment",
            dataIndex: "comment",
            sorter: true,
          },
          {
            title: "Solicitation Code",
            dataIndex: "solicitationCode",
            sorter: true,
            render: (solicitationCode: SolicitationCodeNode) =>
              solicitationCode.name ? (
                <>
                  <b>{`${solicitationCode.prefix}${solicitationCode.code
                    .toString()
                    .padStart(4, "0")}`}</b>
                  {` ${solicitationCode.name}`}
                </>
              ) : (
                <b>{`${solicitationCode.prefix}${solicitationCode.code
                  .toString()
                  .padStart(4, "0")}`}</b>
              ),
          },
          {
            title: "Batch",
            dataIndex: "batch",
            sorter: true,
            render: (batch: { batchType: BatchType; batchNumber: string }) => (
              <abbr title={batch.batchNumber}>
                {stringifyDDNBatchType(batch.batchType)}
              </abbr>
            ),
            filters: Object.keys(BatchType)
              .filter((type) => type !== "Unknown")
              .map((type) => ({
                text: stringifyDDNBatchType(type as BatchType),
                value: type,
              })),
          },
          {
            title: "Created At",
            dataIndex: "createdAt",
            sorter: true,
            defaultSortOrder: getDefaultSortOrder("createdAt", sorters),
          },
          {
            title: "Actions",
            dataIndex: "id",
            render: (uuid: string) => (
              <Flex gap="small" align="center">
                <Link to="/fundraising/ddn/$ddnId" params={{ ddnId: uuid }}>
                  <Button icon={<EyeOutlined />} />
                </Link>
                {/* <Link
                from="/ddns"
                to="$ddnId/edit"
                params={{ ddnId: uuid }}
              >
                <Button icon={<EditOutlined />} />
              </Link> */}
              </Flex>
            ),
          },
        ]}
      />
    </>
  );
};
