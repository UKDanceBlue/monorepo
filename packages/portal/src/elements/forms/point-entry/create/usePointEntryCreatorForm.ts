import { useForm } from "@tanstack/react-form";
import type { VariablesOf } from "gql.tada";
import { useMutation } from "urql";

import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

import {
  createPointEntryAndAssignDocument,
  createPointEntryDocument,
} from "../../../../documents/pointEntry.js";

export function usePointEntryCreatorForm({
  teamUuid,
  onReset,
}: {
  teamUuid: string;
  onReset: () => void;
}) {
  // Form
  const [
    { fetching: createPointEntryFetching, error: createPointEntryError },
    createPointEntry,
  ] = useMutation(createPointEntryDocument);
  useQueryStatusWatcher({
    error: createPointEntryError,
    fetching: createPointEntryFetching,
    loadingMessage: "Saving point entry...",
  });

  const [
    {
      fetching: createPointEntryAndAssignFetching,
      error: createPointEntryAndAssignError,
    },
    createPointEntryAndAssign,
  ] = useMutation(createPointEntryAndAssignDocument);
  useQueryStatusWatcher({
    error: createPointEntryAndAssignError,
    fetching: createPointEntryAndAssignFetching,
    loadingMessage: "Saving point entry...",
  });

  const Form = useForm<
    Omit<
      VariablesOf<typeof createPointEntryAndAssignDocument>["input"],
      "teamUuid"
    > & { shouldAddToTeam: boolean }
  >({
    defaultValues: {
      points: 0,
      shouldAddToTeam: false,
    },
    onSubmit: async ({ value: values, formApi }) => {
      if (values.shouldAddToTeam && values.personFromUuid) {
        await createPointEntryAndAssign({
          input: {
            points: values.points,
            teamUuid,
            comment: values.comment ?? null,
            personFromUuid: values.personFromUuid ?? null,
            opportunityUuid: values.opportunityUuid ?? null,
          },
          person: values.personFromUuid,
          team: teamUuid,
        });
      } else {
        await createPointEntry({
          input: {
            points: values.points,
            teamUuid,
            comment: values.comment ?? null,
            personFromUuid: values.personFromUuid ?? null,
            opportunityUuid: values.opportunityUuid ?? null,
          },
        });
      }
      formApi.reset();
      onReset();
    },
  });

  return { formApi: Form };
}
