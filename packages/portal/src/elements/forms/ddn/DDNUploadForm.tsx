import { type DDNInit, localDateFromJs } from "@ukdanceblue/common";
import { z } from "zod";

import { SpreadsheetUploader } from "#elements/components/SpreadsheetUploader";

const inputTypeSchema = z.object({
  "Division": z.string().trim(),
  "Department": z.string().trim(),
  "Effective Date": z.coerce
    .date()
    .optional()
    .transform((v) => v && localDateFromJs(v).unwrap()),
  "Process Date": z.coerce
    .date()
    .optional()
    .transform((v) => v && localDateFromJs(v).unwrap()),
  "Pledged Date": z.coerce
    .date()
    .optional()
    .transform((v) => v && localDateFromJs(v).unwrap()),
  "Transaction Date": z.coerce
    .date()
    .optional()
    .transform((v) => v && localDateFromJs(v).unwrap()),
  "Transaction  Type": z.string().trim(),
  "Donor1 Amount": z.coerce.number().optional(),
  "Donor2 Amount": z.coerce.number().optional(),
  "Combined Amount": z.coerce.number(),
  "Pledged Amount": z.coerce.number(),
  "Account Number": z.string().trim(),
  "Account Name": z.string().trim(),
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  "Holding Destination": z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  "Comment": z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined),
  "SECShares": z.string().trim().optional(),
  "SECType": z.string().trim().optional(),
  "GIKType": z.string().trim().optional(),
  "GIKDescription": z.string().trim().optional(),
  "Online Gift": z
    .enum(["X", ""])
    .default("")
    .transform((v) => v === "X"),
  "Solicitation Code": z.string().trim(),
  "Solicitation": z.string().trim(),
  "Behalf Honor Memorial": z.string().trim().optional(),
  "Matching Gift": z.string().trim().optional(),
  "Batch": z.string().trim(),
  "UK First Gift": z.enum(["Y", "N"]).transform((v) => v === "Y"),
  "Div First Gift": z.enum(["Y", "N"]).transform((v) => v === "Y"),
  "IDSorter": z.coerce.string().trim(),
  "Combined Donor Name": z.string().trim(),
  "Combined Donor Salutation": z.string().trim(),
  "Combined Donor Sort": z.string().trim(),
  "Donor1 ID": z.coerce.string().trim().optional(),
  "Donor1 Gift Key": z.coerce.number().optional(),
  "Donor1 Name": z.string().trim().optional(),
  "Donor1 Deceased": z
    .enum(["X", ""])
    .default("")
    .transform((v) => v === "X"),
  "Donor1 Constituency": z.string().trim().optional(),
  "Donor1 PM": z.string().trim().optional(),
  "Donor2 PM": z.string().trim().optional(),
  "PLine1": z.string().trim(),
  "PLine2": z.string().trim().optional(),
  "PLine3": z.string().trim().optional(),
  "PCity": z.string().trim(),
  "PState": z.string().trim(),
  "PZip": z.string().trim(),
  "Home Phone": z.string().trim().optional(),
  "Home Phone Restriction": z.string().trim().optional(),
  "Business Phone": z.string().trim().optional(),
  "Business Phone Restriction": z.string().trim().optional(),
  "Email": z.string().trim().optional(),
  "Email Restriction": z.string().trim().optional(),
  "Transmittal SN": z.string().trim().optional(),
  "SAP Doc  Num": z.coerce.string().trim().optional(),
  "SAP Doc  Date": z.coerce
    .date()
    .optional()
    .transform((v) => v && localDateFromJs(v).unwrap()),
  "JV Doc Num": z.string().trim().optional(),
  "Adv Fee CC PHIL": z.coerce.string().trim().optional(),
  "Adv Fee Amt PHIL": z.coerce.number().optional(),
  "Adv Fee CC UNIT": z.coerce.string().trim().optional(),
  "Adv Fee Amt UNIT": z.coerce.number().optional(),
  "Adv Fee Status": z.string().trim(),
  "HCUnit": z.string().trim(),
  "Donor1 Title Bar": z.string().trim().optional(),
  "Donor1 Degrees": z.string().trim().optional(),
  "Donor2 ID": z.string().trim().optional(),
  "Donor2 Gift Key": z.coerce.number().optional(),
  "Donor2 Name": z.string().trim().optional(),
  "Donor2 Deceased": z
    .enum(["X", ""])
    .default("")
    .transform((v) => v === "X"),
  "Donor2 Constituency": z.string().trim().optional(),
  "Donor2 Title Bar": z.string().trim().optional(),
  "Donor2 Degrees": z.string().trim().optional(),
  "Donor1 Relation": z.string().trim().optional(),
  "Donor2 Relation": z.string().trim().optional(),
  "JV Doc Date": z.coerce
    .date()
    .optional()
    .transform((v) => v && localDateFromJs(v).unwrap()),
});

export function DDNUploadForm() {
  return (
    <SpreadsheetUploader
      rowSchema={inputTypeSchema}
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
        console.table(ddnData);
      }}
      text="Upload DDN Spreadsheet"
    />
  );
}
