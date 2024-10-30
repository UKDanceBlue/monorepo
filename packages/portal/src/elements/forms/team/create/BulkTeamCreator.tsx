import type { BulkTeamInput } from "@ukdanceblue/common";
import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import { useMutation } from "urql";

import { useMarathon } from "#config/marathonContext";
import { SpreadsheetUploader } from "#elements/components/SpreadsheetUploader";
import { graphql } from "#graphql/index.js";
import { useAntFeedback } from "#hooks/useAntFeedback";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";

const teamBulkCreatorDocument = graphql(/* GraphQL */ `
  mutation TeamBulkCreator($input: [BulkTeamInput!]!, $marathonId: GlobalId!) {
    bulkLoadTeams(teams: $input, marathonId: $marathonId) {
      id
    }
  }
`);

const nameRow = "Team Name";
const captainLinkblueRow =
  "Team Captain linkblue (if your team has 2 captains,please put the linkblue of both co-captains separated by a comma)";
const pastParticipantRow =
  "Has your team participated in DanceBlue in the past?";

interface SheetRow {
  [nameRow]: string;
  [captainLinkblueRow]: string;
  [pastParticipantRow]: "Yes" | "No";
}

export function BulkTeamCreator() {
  const [{ fetching, error }, bulkCreateTeams] = useMutation(
    teamBulkCreatorDocument
  );
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Creating teams...",
  });

  const selectedMarathon = useMarathon();

  const { showErrorMessage, showSuccessNotification } = useAntFeedback();

  return (
    <SpreadsheetUploader
      rowValidator={(row): row is SheetRow => {
        if (typeof row !== "object" || !row) {
          return false;
        }

        if (
          !(nameRow in row) ||
          !(captainLinkblueRow in row) ||
          !(pastParticipantRow in row)
        ) {
          return false;
        }

        if (
          typeof row[nameRow] !== "string" ||
          typeof row[captainLinkblueRow] !== "string" ||
          typeof row[pastParticipantRow] !== "string" ||
          !["Yes", "No"].includes(row[pastParticipantRow])
        ) {
          return false;
        }

        return true;
      }}
      rowMapper={(row: SheetRow): BulkTeamInput => {
        return {
          name: row[nameRow],
          type: TeamType.Spirit,
          legacyStatus:
            row[pastParticipantRow] === "Yes"
              ? TeamLegacyStatus.ReturningTeam
              : TeamLegacyStatus.NewTeam,
          captainLinkblues: row[captainLinkblueRow]
            .split(",")
            .map((linkblue) => linkblue.trim().split("@")[0]!),
          memberLinkblues: null,
        };
      }}
      onUpload={async (output) => {
        if (!selectedMarathon) {
          throw new Error("No marathon selected");
        }
        const result = await bulkCreateTeams({
          input: output,
          marathonId: selectedMarathon.id,
        });

        if (result.error) {
          showErrorMessage(String(result.error));
          return;
        }

        showSuccessNotification({ message: "Teams created successfully" });
      }}
    />
  );
}
