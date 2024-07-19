import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { TeamType } from "@ukdanceblue/common";
import type {
  DocumentType,
  FragmentType,
} from "@ukdanceblue/common/graphql-client-portal";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-portal";
import { type SetTeamInput } from "@ukdanceblue/common/graphql-client-portal/raw-types";
import { useMutation } from "urql";

import { TeamEditorFragment, teamEditorDocument } from "./TeamEditorGQL";

export function useTeamEditorForm(
  teamFragment: FragmentType<typeof TeamEditorFragment> | undefined,
  afterSubmit:
    | ((
        ret: DocumentType<typeof teamEditorDocument>["setTeam"] | undefined
      ) => void | Promise<void>)
    | undefined
) {
  const teamData = getFragmentData(TeamEditorFragment, teamFragment);

  // Form
  const [{ fetching, error }, setTeam] = useMutation(teamEditorDocument);
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving team...",
  });

  const Form = useForm<SetTeamInput>({
    defaultValues: {
      name: teamData?.name ?? "",
      legacyStatus: teamData?.legacyStatus ?? null,
      type: teamData?.type ?? TeamType.Spirit,
    },
    onSubmit: async (values) => {
      if (!teamData?.id) {
        throw new Error("Team UUID is required");
      }

      const { data } = await setTeam({
        uuid: teamData.id,
        input: {
          name: values.name ?? null,
          legacyStatus: values.legacyStatus ?? null,
          type: values.type ?? null,
        },
      });

      return afterSubmit?.(data?.setTeam);
    },
  });

  return {
    formApi: Form,
  };
}
