import { createFileRoute } from "@tanstack/react-router";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
} from "@ukdanceblue/common";

import { DDNUploadForm } from "#elements/forms/ddn/DDNUploadForm";

function DDNSpreadsheetUploader() {
  return (
    <div>
      <h1>DDN Spreadsheet Uploader</h1>
      <p>
        This page allows you to upload a spreadsheet of DDN data. The data will
        be validated and imported into the system. You will be able to review
        the data before it is imported.
      </p>
      <DDNUploadForm />
    </div>
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
