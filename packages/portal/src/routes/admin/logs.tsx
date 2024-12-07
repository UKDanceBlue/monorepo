import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "urql";

import { LogViewer } from "#elements/viewers/admin/LogViewer.js";
import { graphql } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const logsPageDocument = graphql(/* GraphQL */ `
  query LogsPage {
    auditLog
  }
`);

function LogsPage() {
  const [{ data, fetching, error }] = useQuery({
    query: logsPageDocument,
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading logs...",
  });

  return <LogViewer logs={data?.auditLog} />;
}

export const Route = createFileRoute("/admin/logs")({
  component: LogsPage,
  async beforeLoad({ context }) {
    await context.urqlClient.query(logsPageDocument, {});
  },
});
