import { teamCreatorDocument } from "./TeamCreatorGQL";

import { useMarathon } from "@config/marathonContext";
import { useAntFeedback } from "@hooks/useAntFeedback";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import { type CreateTeamInput } from "@ukdanceblue/common/graphql-client-portal/raw-types";
import { useMutation } from "urql";

import type { DocumentType } from "@ukdanceblue/common/graphql-client-portal";


export function useTeamCreatorForm(
  afterSubmit:
    | ((
        ret: DocumentType<typeof teamCreatorDocument>["createTeam"] | undefined
      ) => void | Promise<void>)
    | undefined
) {
  // Form
  const [{ fetching, error }, createTeam] = useMutation(teamCreatorDocument);
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving team...",
  });

  const marathonId = useMarathon()?.id;
  const { showErrorMessage } = useAntFeedback();

  const Form = useForm<CreateTeamInput>({
    defaultValues: {
      name: "",
      legacyStatus: TeamLegacyStatus.NewTeam,
      type: TeamType.Spirit,
    },
    onSubmit: async (values) => {
      if (!marathonId) {
        void showErrorMessage("No marathon selected");
        return;
      }
      const { data } = await createTeam({
        input: {
          name: values.name,
          legacyStatus: values.legacyStatus,
          type: values.type,
        },
        marathonUuid: marathonId,
      });

      return afterSubmit?.(data?.createTeam);
    },
  });

  return {
    formApi: Form,
  };
}
