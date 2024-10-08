import { LogViewer } from "@elements/viewers/admin/LogViewer";
import { graphql } from "@graphql/index.js";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { createFileRoute } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel } from "@ukdanceblue/common";
import { useQuery } from "urql";

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
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.SuperAdmin,
      },
    ],
  },
});
