import { useForm } from "@tanstack/react-form";
import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import { useMutation } from "urql";

import { teamCreatorDocument } from "#documents/team.js";
import type { InputOf, ResultOf } from "#graphql/index.js";
import { useAntFeedback } from "#hooks/useAntFeedback.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

export function useTeamCreatorForm(
  afterSubmit:
    | ((
        ret: ResultOf<typeof teamCreatorDocument>["createTeam"] | undefined
      ) => void | Promise<void>)
    | undefined,
  selectedMarathonId: string | undefined
) {
  // Form
  const [{ fetching, error }, createTeam] = useMutation(teamCreatorDocument);
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving team...",
  });

  const { showErrorMessage } = useAntFeedback();

  const Form = useForm<InputOf<typeof teamCreatorDocument>>({
    defaultValues: {
      name: "",
      legacyStatus: TeamLegacyStatus.NewTeam,
      type: TeamType.Spirit,
    },
    onSubmit: async ({ value: values }) => {
      if (!selectedMarathonId) {
        void showErrorMessage("No marathon selected");
        return;
      }
      const { data } = await createTeam({
        input: {
          name: values.name,
          legacyStatus: values.legacyStatus,
          type: values.type,
        },
        marathonUuid: selectedMarathonId,
      });

      return afterSubmit?.(data?.createTeam);
    },
  });

  return {
    formApi: Form,
  };
}
