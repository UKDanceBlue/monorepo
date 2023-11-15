import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import type { CreatePointEntryInput } from "@ukdanceblue/common/graphql-client-admin/raw-types";
import { useMutation } from "urql";

import { createPointEntryDocument } from "./PointEntryCreatorGQL";

export function usePointEntryCreatorForm({ teamUuid }: { teamUuid: string }) {
  // Form
  const [{ fetching, error }, createPointEntry] = useMutation(
    createPointEntryDocument
  );
  const navigate = useNavigate();
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
        },
      });
      await navigate({
        to: "/", // TODO: Navigate to the team page
      });
    },
  });

  return { formApi: Form };
}
