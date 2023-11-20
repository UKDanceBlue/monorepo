import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import type { DocumentType } from "@ukdanceblue/common/graphql-client-admin";
import { type CreateTeamInput } from "@ukdanceblue/common/graphql-client-admin/raw-types";
import { useMutation } from "urql";

import { teamCreatorDocument } from "./TeamCreatorGQL";

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

  const Form = useForm<CreateTeamInput>({
    defaultValues: {
      name: "",
      legacyStatus: TeamLegacyStatus.NewTeam,
      marathonYear: "DB24",
      persistentIdentifier: null,
      type: TeamType.Spirit,
    },
    onSubmit: async (values) => {
      const { data } = await createTeam({
        input: {
          name: values.name,
          legacyStatus: values.legacyStatus,
          // TODO: Make this dynamic
          marathonYear: "DB24",
          persistentIdentifier: values.persistentIdentifier ?? null,
          type: values.type,
        },
      });

      return afterSubmit?.(data?.createTeam);
    },
  });

  return {
    formApi: Form,
  };
}
