import { BatchType } from "@ukdanceblue/common";
import { extractDDNBatchType, type LocalDate } from "@ukdanceblue/common";
import { z } from "zod";

import { UploadButton } from "#elements/components/UploadButton.tsx";
import {
  defaultDateValidator,
  defaultFloatValidator,
  defaultStringValidator,
} from "#elements/validators.ts";
import { graphql } from "#gql/index.ts";
import { useTypedCreate } from "#hooks/useTypedRefine.ts";

export function CustomFundraisingEntryUploadButton() {
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
          // validator: z.string().or(
          //   (z.nativeEnum(BatchType),
          //   z
          //     .string()
          //     .regex(/\d[ACDNPTX]\d$/)
          //     .transform((v) => extractDDNBatchType(v).unwrap()))
          // ),
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
      title="Upload Fundraising Entries"
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
    />
  );
}
