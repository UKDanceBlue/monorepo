import { createPointEntryDocument } from "./PointEntryCreatorGQL";

import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "urql";

import type { CreatePointEntryInput } from "@ukdanceblue/common/graphql-client-portal/raw-types";


export function usePointEntryCreatorForm({
  teamUuid,
  onReset,
}: {
  teamUuid: string;
  onReset: () => void;
}) {
  // Form
  const [{ fetching, error }, createPointEntry] = useMutation(
    createPointEntryDocument
  );
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving point entry...",
  });

  const Form = useForm<Omit<CreatePointEntryInput, "teamUuid">>({
    defaultValues: {
      points: 0,
    },
    onSubmit: async (values) => {
      await createPointEntry({
        input: {
          points: values.points,
          teamUuid,
          comment: values.comment ?? null,
          personFromUuid: values.personFromUuid ?? null,
          opportunityUuid: values.opportunityUuid ?? null,
        },
      });
      onReset();
      Form.reset();
    },
  });

  return { formApi: Form };
}
