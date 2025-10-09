import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import { useMutation } from "urql";
import { z } from "zod";

import { useMarathon } from "#config/marathonContext.js";
import { UploadButton } from "#elements/components/UploadButton.tsx";
import { graphql } from "#gql/index.js";
import { useAntFeedback } from "#hooks/useAntFeedback.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const teamBulkCreatorDocument = graphql(/* GraphQL */ `
  mutation TeamBulkCreator($input: [BulkTeamInput!]!, $marathonId: GlobalId!) {
    createTeams(teams: $input, marathonId: $marathonId) {
      id
    }
  }
`);

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
    <UploadButton
      title="Import Teams"
      columns={[
        { title: "Team Name", id: "name", validator: z.string().min(1).trim() },
        {
          title: "Team Captain linkblue(s)",
          id: "captainLinkblues",
          validator: z
            .string()
            .trim()
            .transform((val) => val.split(","))
            .pipe(
              z
                .array(
                  z
                    .string()
                    .trim()
                    .min(1)
                    .regex(/^[\dA-Za-z]+$/, "Invalid linkblue format")
                )
                .nonempty("At least one Team Captain linkblue is required")
            ),
        },
        {
          title: "Returning Team",
          id: "legacyStatus",
          validator: z
            .enum(["Yes", "No"], {
              errorMap: () => ({
                message:
                  "Has your team participated in DanceBlue in the past? is required",
              }),
            })
            .transform((val) =>
              val === "Yes"
                ? TeamLegacyStatus.ReturningTeam
                : TeamLegacyStatus.NewTeam
            ),
        },
        {
          title: "Team Type",
          id: "type",
          validator: z
            .enum([TeamType.Spirit, TeamType.Morale, TeamType.Mini])
            .default(TeamType.Spirit),
        },
      ]}
      confirmText="Upload"
      onConfirm={async (
        output: {
          name: string;
          captainLinkblues: string[];
          legacyStatus: TeamLegacyStatus;
          type: TeamType | undefined;
        }[]
      ) => {
        if (!selectedMarathon) {
          throw new Error("No marathon selected");
        }
        const result = await bulkCreateTeams({
          input: output.map((row) => ({
            name: row.name,
            captainLinkblues: row.captainLinkblues,
            legacyStatus: row.legacyStatus,
            type: row.type ?? TeamType.Spirit,
          })),
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
