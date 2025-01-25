import { createFileRoute } from "@tanstack/react-router";

import { BulkPersonCreator } from "#elements/forms/person/create/BulkPersonCreator.js";

function BulkCreatePersonPage() {
  return (
    <div>
      <h1>Upload Person CSV</h1>
      <BulkPersonCreator />
    </div>
  );
}

export const Route = createFileRoute("/people/bulk")({
  component: BulkCreatePersonPage,
});
