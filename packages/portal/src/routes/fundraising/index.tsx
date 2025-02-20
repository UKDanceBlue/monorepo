import {
  BarsOutlined,
  FileOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CommitteeIdentifier, CommitteeRole } from "@ukdanceblue/common";
import { BatchType } from "@ukdanceblue/common";
import { extractDDNBatchType, type LocalDate } from "@ukdanceblue/common";
import { Button, Collapse, Flex, Popover } from "antd";
import { z } from "zod";

import { useMarathon } from "#config/marathonContext.ts";
import { UploadButton } from "#elements/components/UploadButton.tsx";
import { FundraisingEntriesTable } from "#elements/tables/fundraising/FundraisingEntriesTable";
import {
  defaultDateValidator,
  defaultFloatValidator,
  defaultStringValidator,
} from "#elements/validators.ts";
import { graphql } from "#gql/index.ts";
import {
  useAuthorizationRequirement,
  useLoginState,
} from "#hooks/useLoginState.js";
import { useTypedCustomQuery } from "#hooks/useTypedRefine.tsx";
import { useTypedCreate } from "#hooks/useTypedRefine.tsx";

export const Route = createFileRoute("/fundraising/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { authorization } = useLoginState();
  const showTotal =
    authorization?.effectiveCommitteeRoles.find(
      ({ identifier }) => identifier === CommitteeIdentifier.overallCommittee
    )?.role === CommitteeRole.Chair;

  const { id: marathonId, year } = useMarathon() ?? {};
  const grandTotal = useTypedCustomQuery({
    document: graphql(/* GraphQL */ `
      query GrandTotal($marathonId: GlobalId!) {
        grandTotal(marathonId: $marathonId)
      }
    `),
    props: {
      queryOptions: {
        enabled: showTotal && marathonId != null,
      },
    },
    gqlVariables: {
      marathonId,
    },
  });

  return (
    <List
      title="Fundraising Entries"
      headerButtons={
        <>
          {useAuthorizationRequirement("create", {
            kind: "FundraisingEntryNode",
          }) && (
            <Link from="/fundraising" to="create">
              <Button icon={<PlusOutlined />}>Create Entry</Button>
            </Link>
          )}
          {useAuthorizationRequirement("list", {
            kind: "DailyDepartmentNotificationNode",
          }) && (
            <Link from="/fundraising" to="ddn">
              <Button icon={<BarsOutlined />}>View Raw DDNs</Button>
            </Link>
          )}
          {useAuthorizationRequirement("create", {
            kind: "DailyDepartmentNotificationNode",
          }) && (
            <Popover
              arrow={false}
              content={
                <Flex vertical gap="small" justify="center" align="start">
                  <Link from="/fundraising" to="ddn/upload">
                    <Button
                      icon={<UploadOutlined />}
                      size="small"
                      type="text"
                      style={{ width: "100%" }}
                    >
                      DDN
                    </Button>
                  </Link>
                  <CustomFundraisingEntryUploadButton />
                </Flex>
              }
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Popover>
          )}
          {useAuthorizationRequirement("list", {
            kind: "FundraisingEntryNode",
          }) && (
            <Link from="/fundraising" to="report">
              <Button icon={<FileOutlined />}>Generate Report</Button>
            </Link>
          )}
        </>
      }
    >
      <Flex vertical gap="large">
        {grandTotal.data && (
          <Collapse
            items={[
              {
                label: "Grand Total (For Overall Chair's Eyes Only",
                children: (
                  <Flex justify="center" vertical>
                    <img
                      style={{
                        width: "100%",
                        maxWidth: "60ch",
                        display: "block",
                      }}
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/%22Loose_lips_might_sink_ships%22_-_NARA_-_513543.jpg/800px-%22Loose_lips_might_sink_ships%22_-_NARA_-_513543.jpg"
                    />
                    <p>
                      Grand total for {year} fiscal year:{" "}
                      <span className="hide-unless-hover">
                        ${String(grandTotal.data.data.grandTotal)}
                      </span>{" "}
                      (hover to view)
                    </p>
                  </Flex>
                ),
              },
            ]}
          />
        )}
        <FundraisingEntriesTable showSolicitationCode />
      </Flex>
    </List>
  );
}

function CustomFundraisingEntryUploadButton() {
  const { mutateAsync } = useTypedCreate({
    document: graphql(/* GraphQL */ `
      mutation CreateFundraisingEntries(
        $input: [CreateFundraisingEntryInput!]!
      ) {
        createFundraisingEntries(input: $input) {
          id
          amount
          donatedByText
          donatedToText
          notes
          solicitationCode {
            id
          }
          batchType
          donatedOn
        }
      }
    `),
    props: {
      resource: "fundraisingEntry",
    },
  });

  return (
    <UploadButton
      columns={[
        {
          id: "amount",
          title: "Amount",
          validator: defaultFloatValidator,
        },
        {
          id: "donatedBy",
          title: "Donated By",
          validator: defaultStringValidator,
        },
        {
          id: "donatedTo",
          title: "Donated To",
          validator: defaultStringValidator,
        },
        {
          id: "donatedOn",
          title: "Donated On",
          validator: defaultDateValidator,
        },
        {
          id: "notes",
          title: "Notes",
          validator: defaultStringValidator,
        },
        {
          id: "solicitationCodeId",
          title: "Solicitation Code",
          validator: z
            .string()
            .trim()
            .regex(/^([A-Z]{2}\d{4})$/)
            .describe("Must be a valid solicitation code of the form XX1234"),
        },
        {
          id: "batchType",
          title: "Batch",
          validator: z.string().transform((v, ctx) => {
            if (/\d[ACDNPTX]\d$/.test(v)) {
              const extracted = extractDDNBatchType(v);
              if (extracted.isErr()) {
                ctx.addIssue({
                  code: "custom",
                  fatal: true,
                  message: extracted.error.message,
                });
                return undefined;
              }
              return extracted.value;
            }
            if (Object.values(BatchType).includes(v as BatchType)) {
              return v as BatchType;
            } else {
              ctx.addIssue({
                code: "custom",
                fatal: true,
                message: "Invalid Batch Type",
              });
              return undefined;
            }
          }),
        },
      ]}
      title="Custom"
      onConfirm={async (
        values: {
          amount: number;
          donatedBy: string | undefined;
          donatedTo: string | undefined;
          donatedOn: LocalDate | undefined;
          notes: string | undefined;
          solicitationCodeId: string;
          batchType: BatchType;
        }[]
      ) => {
        await mutateAsync({
          values,
        });
      }}
      buttonProps={{
        size: "small",
        type: "text",
      }}
    />
  );
}
