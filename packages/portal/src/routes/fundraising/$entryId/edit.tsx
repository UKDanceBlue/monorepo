import { createFileRoute, useParams } from "@tanstack/react-router";

import { FundraisingEntryEditor } from "#elements/forms/fundraising-entry/edit/FundraisingEntryEditor.js";

export const Route = createFileRoute("/fundraising/$entryId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { entryId } = useParams({
    from: "/fundraising/$entryId/edit",
  });

  return <FundraisingEntryEditor id={entryId} />;
}
