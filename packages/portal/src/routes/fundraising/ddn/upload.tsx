import { createFileRoute } from "@tanstack/react-router";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
} from "@ukdanceblue/common";

export const Route = createFileRoute("/fundraising/ddn/upload")({
  component: () => <div>Hello /fundraising/ddn/upload!</div>,
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
