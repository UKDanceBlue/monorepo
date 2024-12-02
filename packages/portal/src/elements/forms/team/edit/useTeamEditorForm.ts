import { useForm } from "@tanstack/react-form";
import { TeamType } from "@ukdanceblue/common";
import { useMutation } from "urql";

import { teamEditorDocument, TeamEditorFragment } from "#documents/team.js";
import type { FragmentOf, InputOf, ResultOf } from "#graphql/index.js";
import { readFragment } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

export function useTeamEditorForm(
  teamFragment: FragmentOf<typeof TeamEditorFragment> | undefined,
  afterSubmit:
    | ((
        ret: ResultOf<typeof teamEditorDocument>["setTeam"] | undefined
      ) => void | Promise<void>)
    | undefined
) {
  const teamData = readFragment(TeamEditorFragment, teamFragment);

  // Form
  const [{ fetching, error }, setTeam] = useMutation(teamEditorDocument);
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving team...",
  });

  const Form = useForm<InputOf<typeof teamEditorDocument>>({
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
