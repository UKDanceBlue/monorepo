import { type DDNInit, localDateFromJs } from "@ukdanceblue/common";
import { useMutation } from "urql";
import { z } from "zod";

import { SpreadsheetUploader } from "#elements/components/SpreadsheetUploader";
import { graphql } from "#gql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";

const defaultStringValidator = z
  .string()
  .trim()
  .optional()
  .transform((v) => v || undefined);

const defaultDateValidator = z
  .string()
  .transform((v) =>
    v ? localDateFromJs(new Date(v)).unwrapOr(undefined) : undefined
  )
  .optional();

const defaultFloatValidator = z
  .string({ coerce: true })
  .regex(/^\d*(,\d+)*(\.\d+)?$/)
  .trim()
  .default("0")
  .transform((v) => {
    if (v === "") {
      return 0;
    }
    v = v.replaceAll(",", "");
    const parsed = Number.parseFloat(v);
    if (Number.isNaN(parsed)) {
      return 0;
    }
    return parsed;
  });

const inputTypeSchema = z.object({
  "Division": z.string().trim(),
  "Department": z.string().trim(),
  "Effective Date": defaultDateValidator,
  "Process Date": z
    .string()
    .trim()
    .transform((v) => localDateFromJs(new Date(v)).unwrap()),
  "Pledged Date": defaultDateValidator,
  "Transaction Date": defaultDateValidator,
  "Transaction  Type": z.string().trim(),
  "Donor1 Amount": defaultFloatValidator.optional(),
  "Donor2 Amount": defaultFloatValidator.optional(),
  "Combined Amount": defaultFloatValidator,
  "Pledged Amount": defaultFloatValidator,
  "Account Number": z.string().trim(),
  "Account Name": z.string().trim(),
  "Holding Destination": z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  "Comment": z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  "SECShares": defaultStringValidator,
  "SECType": defaultStringValidator,
  "GIKType": defaultStringValidator,
  "GIKDescription": defaultStringValidator,
  "Online Gift": z
    .enum(["X", ""])
    .default("")
    .transform((v) => v === "X"),
  "Solicitation Code": z.string().trim(),
  "Solicitation": z.string().trim(),
  "Behalf Honor Memorial": defaultStringValidator,
  "Matching Gift": defaultStringValidator,
  "Batch": z.string().trim(),
  "UK First Gift": z.enum(["Y", "N"]).transform((v) => v === "Y"),
  "Div First Gift": z.enum(["Y", "N"]).transform((v) => v === "Y"),
  "IDSorter": z.coerce.string().trim(),
  "Combined Donor Name": z.string().trim(),
  "Combined Donor Salutation": z.string().trim(),
  "Combined Donor Sort": z.string().trim(),
  "Donor1 ID": z.coerce
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  "Donor1 Gift Key": z.coerce
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  "Donor1 Name": defaultStringValidator,
  "Donor1 Deceased": z
    .enum(["X", ""])
    .default("")
    .transform((v) => v === "X"),
  "Donor1 Constituency": defaultStringValidator,
  "Donor1 PM": defaultStringValidator,
  "Donor2 PM": defaultStringValidator,
  "PLine1": z.string().trim(),
  "PLine2": defaultStringValidator,
  "PLine3": defaultStringValidator,
  "PCity": z.string().trim(),
  "PState": z.string().trim(),
  "PZip": z.string().trim(),
  "Home Phone": defaultStringValidator,
  "Home Phone Restriction": defaultStringValidator,
  "Business Phone": defaultStringValidator,
  "Business Phone Restriction": defaultStringValidator,
  "Email": defaultStringValidator,
  "Email Restriction": defaultStringValidator,
  "Transmittal SN": defaultStringValidator,
  "SAP Doc  Num": z.coerce
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  "SAP Doc  Date": defaultDateValidator,
  "JV Doc Num": defaultStringValidator,
  "Adv Fee CC PHIL": z.coerce
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  "Adv Fee Amt PHIL": z.coerce.number().optional(),
  "Adv Fee CC UNIT": z.coerce
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  "Adv Fee Amt UNIT": z.coerce.number().optional(),
  "Adv Fee Status": z.string().trim(),
  "HCUnit": z.string().trim(),
  "Donor1 Title Bar": defaultStringValidator,
  "Donor1 Degrees": defaultStringValidator,
  "Donor2 ID": defaultStringValidator,
  "Donor2 Gift Key": z.coerce
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  "Donor2 Name": defaultStringValidator,
  "Donor2 Deceased": z
    .enum(["X", ""])
    .default("")
    .transform((v) => v === "X"),
  "Donor2 Constituency": defaultStringValidator,
  "Donor2 Title Bar": defaultStringValidator,
  "Donor2 Degrees": defaultStringValidator,
  "Donor1 Relation": defaultStringValidator,
  "Donor2 Relation": defaultStringValidator,
  "JV Doc Date": defaultDateValidator,
});

const UploadDdnDocument = graphql(/* GraphQL */ `
  mutation UploadDdnDocument($ddnData: [DailyDepartmentNotificationInput!]!) {
    batchUploadDailyDepartmentNotifications(input: $ddnData) {
      id
    }
  }
`);

export function DDNUploadForm() {
  const [uploadDdnDocumentStatus, uploadDdn] = useMutation(UploadDdnDocument);
  useQueryStatusWatcher({
    ...uploadDdnDocumentStatus,
    loadingMessage: "Uploading DDN data...",
  });
  return (
    <SpreadsheetUploader
      rowSchema={inputTypeSchema}
      paginate={false}
      onUpload={async (output) => {
        const ddnData: DDNInit[] = output.map(
          (row): DDNInit => ({
            division: row.Division,
            department: row.Department,
            effectiveDate: row["Effective Date"],
            processDate: row["Process Date"],
            pledgedDate: row["Pledged Date"],
            transactionDate: row["Transaction Date"],
            transactionType: row["Transaction  Type"],
            donor1Amount: row["Donor1 Amount"],
            donor2Amount: row["Donor2 Amount"],
            combinedAmount: row["Combined Amount"],
            pledgedAmount: row["Pledged Amount"],
            accountNumber: row["Account Number"],
            accountName: row["Account Name"],
            holdingDestination: row["Holding Destination"],
            comment: row.Comment,
            secShares: row.SECShares,
            secType: row.SECType,
            gikType: row.GIKType,
            gikDescription: row.GIKDescription,
            onlineGift: row["Online Gift"],
            solicitationCode: row["Solicitation Code"],
            solicitation: row.Solicitation,
            behalfHonorMemorial: row["Behalf Honor Memorial"],
            matchingGift: row["Matching Gift"],
            batchId: row.Batch,
            ukFirstGift: row["UK First Gift"],
            divFirstGift: row["Div First Gift"],
            idSorter: row.IDSorter,
            combinedDonorName: row["Combined Donor Name"],
            combinedDonorSalutation: row["Combined Donor Salutation"],
            combinedDonorSort: row["Combined Donor Sort"],
            donor1Id: row["Donor1 ID"],
            donor1GiftKey: row["Donor1 Gift Key"],
            donor1Name: row["Donor1 Name"],
            donor1Deceased: row["Donor1 Deceased"],
            donor1Constituency: row["Donor1 Constituency"],
            donor1TitleBar: row["Donor1 Title Bar"],
            donor1Pm: row["Donor1 PM"],
            donor1Degrees: row["Donor1 Degrees"],
            donor2Id: row["Donor2 ID"],
            donor2GiftKey: row["Donor2 Gift Key"],
            donor2Name: row["Donor2 Name"],
            donor2Deceased: row["Donor2 Deceased"],
            donor2Constituency: row["Donor2 Constituency"],
            donor2TitleBar: row["Donor2 Title Bar"],
            donor2Pm: row["Donor2 PM"],
            donor2Degrees: row["Donor2 Degrees"],
            donor1Relation: row["Donor1 Relation"],
            donor2Relation: row["Donor2 Relation"],
            transmittalSn: row["Transmittal SN"],
            sapDocNum: row["SAP Doc  Num"],
            sapDocDate: row["SAP Doc  Date"],
            jvDocNum: row["JV Doc Num"],
            jvDocDate: row["JV Doc Date"],
            advFeeCcPhil: row["Adv Fee CC PHIL"],
            advFeeAmtPhil: row["Adv Fee Amt PHIL"],
            advFeeCcUnit: row["Adv Fee CC UNIT"],
            advFeeAmtUnit: row["Adv Fee Amt UNIT"],
            advFeeStatus: row["Adv Fee Status"],
            hcUnit: row.HCUnit,
          })
        );

        await uploadDdn({
          ddnData,
        });
      }}
      text="Upload DDN Spreadsheet"
    />
  );
}
