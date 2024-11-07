import { useForm } from "@tanstack/react-form";
import { TeamType } from "@ukdanceblue/common";
import { useMutation } from "urql";

import { type SetTeamInput } from "#graphql/graphql.js";
import type { DocumentType, FragmentType } from "#graphql/index.js";
import { getFragmentData } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";

import { teamEditorDocument,TeamEditorFragment } from "./TeamEditorGQL";

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
    onSubmit: async ({ value: values }) => {
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
