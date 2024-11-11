import { createFileRoute } from "@tanstack/react-router";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
} from "@ukdanceblue/common";

import { SpreadsheetUploader } from "#elements/components/SpreadsheetUploader";

function DDNSpreadsheetUploader() {
  return (
    <SpreadsheetUploader
      rowValidator={(_row: unknown): _row is object => {
        return true;
      }}
      rowMapper={(row) => row}
      onUpload={async (output) => {
        console.log(output);
      }}
      text="Upload DDN Spreadsheet"
    />
  );
}

export const Route = createFileRoute("/fundraising/ddn/upload")({
  component: DDNSpreadsheetUploader,
  staticData: {
    authorizationRules: [
      {
        minCommitteeRole: CommitteeRole.Coordinator,
        committeeIdentifiers: [CommitteeIdentifier.fundraisingCommittee],
      },
      {
        accessLevel: AccessLevel.Admin,
      },
    ],
  },
});
