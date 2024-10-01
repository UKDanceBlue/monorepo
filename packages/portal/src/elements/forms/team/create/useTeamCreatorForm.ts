import { teamCreatorDocument } from "./TeamCreatorGQL";

import { useAntFeedback } from "@hooks/useAntFeedback";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import { type CreateTeamInput } from "@graphql/raw-types";
import { useMutation } from "urql";

import type { DocumentType } from "@graphql";

export function useTeamCreatorForm(
  afterSubmit:
    | ((
        ret: DocumentType<typeof teamCreatorDocument>["createTeam"] | undefined
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

  const Form = useForm<CreateTeamInput>({
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
