import { CommitteeIdentifier, CommitteeRole } from "@ukdanceblue/common";
import { useMutation } from "urql";

import { useMarathon } from "#config/marathonContext.js";
import { SpreadsheetUploader } from "#elements/components/SpreadsheetUploader.js";
import type { InputOf } from "#graphql/index.js";
import { graphql } from "#graphql/index.js";
import { useAntFeedback } from "#hooks/useAntFeedback.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const personBulkCreatorDocument = graphql(/* GraphQL */ `
  mutation PersonBulkCreator(
    $input: [BulkPersonInput!]!
    $marathonId: GlobalId!
  ) {
    bulkLoadPeople(people: $input, marathonId: $marathonId) {
      id
    }
  }
`);

function mapCommitteeNameToIdentifier(committee: string): CommitteeIdentifier {
  switch (committee) {
    case "Community Development/Morale": {
      return CommitteeIdentifier.communityDevelopmentCommittee;
    }
    case "Overall": {
      return CommitteeIdentifier.overallCommittee;
    }
    case "Corporate Relations": {
      return CommitteeIdentifier.corporateCommittee;
    }
    case "Dancer Relations": {
      return CommitteeIdentifier.dancerRelationsCommittee;
    }
    case "Family Relations": {
      return CommitteeIdentifier.familyRelationsCommittee;
    }
    case "Fundraising": {
      return CommitteeIdentifier.fundraisingCommittee;
    }
    case "Marketing": {
      return CommitteeIdentifier.marketingCommittee;
    }
    case "Corporate": {
      return CommitteeIdentifier.corporateCommittee;
    }
    case "Mini Marathons": {
      return CommitteeIdentifier.miniMarathonsCommittee;
    }
    case "Operations": {
      return CommitteeIdentifier.operationsCommittee;
    }
    case "Programming": {
      return CommitteeIdentifier.programmingCommittee;
    }
    case "Technology": {
      return CommitteeIdentifier.techCommittee;
    }
    default: {
      throw new Error(`Unknown committee: ${committee}`);
    }
  }
}

interface CsvRow {
  name: string;
  email: `${string}@uky.edu`;
  linkblue: string;
  committee?:
    | "Community Development/Morale"
    | "Overall"
    | "Corporate Relations"
    | "Dancer Relations"
    | "Family Relations"
    | "Fundraising"
    | "Marketing"
    | "Corporate"
    | "Mini Marathons"
    | "Operations"
    | "Programming"
    | "Technology";
  role?: "Chair" | "Coordinator" | "Member";
}

export function BulkPersonCreator() {
  const [{ fetching, error }, bulkCreatePeople] = useMutation(
    personBulkCreatorDocument
  );
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Creating people...",
  });

  const selectedMarathon = useMarathon();

  const { showErrorMessage, showSuccessNotification } = useAntFeedback();

  return (
    <SpreadsheetUploader
      rowValidator={(row): row is CsvRow => {
        if (typeof row !== "object" || !row) {
          return false;
        }

        if (!("name" in row) || !("email" in row) || !("linkblue" in row)) {
          return false;
        }

        if (
          typeof row.name !== "string" ||
          typeof row.email !== "string" ||
          typeof row.linkblue !== "string"
        ) {
          return false;
        }

        if (!row.email.endsWith("@uky.edu")) {
          return false;
        }

        if (
          "committee" in row &&
          (typeof row.committee !== "string" ||
            ![
              "Community Development/Morale",
              "Overall",
              "Corporate Relations",
              "Dancer Relations",
              "Family Relations",
              "Fundraising",
              "Marketing",
              "Corporate",
              "Mini Marathons",
              "Operations",
              "Programming",
              "Technology",
            ].includes(row.committee))
        ) {
          return false;
        }

        if (
          "role" in row &&
          (typeof row.role !== "string" ||
            !["Chair", "Coordinator", "Member"].includes(row.role))
        ) {
          return false;
        }

        return true;
      }}
      rowMapper={(
        row: CsvRow
      ): InputOf<typeof personBulkCreatorDocument>[number] => {
        return {
          name: row.name,
          email: row.email,
          linkblue: row.linkblue,
          committee: row.committee
            ? mapCommitteeNameToIdentifier(row.committee)
            : undefined,
          role: row.role
            ? row.role === "Chair"
              ? CommitteeRole.Chair
              : row.role === "Coordinator"
                ? CommitteeRole.Coordinator
                : (row.role satisfies typeof CommitteeRole.Member)
            : undefined,
        };
      }}
      onUpload={async (output) => {
        if (!selectedMarathon) {
          throw new Error("No marathon selected");
        }
        const result = await bulkCreatePeople({
          input: output,
          marathonId: selectedMarathon.id,
        });

        if (result.error) {
          showErrorMessage(String(result.error));
          return;
        }

        showSuccessNotification({ message: "People created successfully" });
      }}
    />
  );
}
