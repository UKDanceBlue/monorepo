import { createFileRoute } from "@tanstack/react-router";

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
});
