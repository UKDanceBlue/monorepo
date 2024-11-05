import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import type { DateTime } from "luxon";
import { useMutation } from "urql";

import { graphql } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";

export function useMarathonCreatorForm() {
  // Form
  const [{ fetching, error }, createMarathon] = useMutation(
    graphql(/* GraphQL */ `
      mutation CreateMarathon($input: CreateMarathonInput!) {
        createMarathon(input: $input) {
          id
        }
      }
    `)
  );
  const navigate = useNavigate();
  const { resetWatcher } = useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving marathon...",
  });

  const Form = useForm<{
    year: string | undefined;
    startDate: DateTime | undefined;
    endDate: DateTime | undefined;
  }>({
    defaultValues: {
      year: undefined,
      startDate: undefined,
      endDate: undefined,
    },
    validators: {
      onChange: ({ value: { startDate, endDate } }) => {
        if (startDate && endDate && startDate.toMillis() > endDate.toMillis()) {
          return "Start date must be before end date";
        }

        return undefined;
      },
    },
    onSubmit: async ({ value: values }) => {
      if (
        !values.year ||
        (values.startDate && !values.startDate.isValid) ||
        (values.endDate && !values.endDate.isValid)
      ) {
        return;
      }

      const { data } = await createMarathon({
        input: {
          year: values.year,
          startDate: values.startDate
            ?.set({ minute: 0, second: 0, millisecond: 0 })
            .toISO(),
          endDate: values.endDate
            ?.set({ minute: 0, second: 0, millisecond: 0 })
            .toISO(),
        },
      });

      if (data) {
        resetWatcher();
        await navigate({
          to: "/marathon/$marathonId",
          params: { marathonId: data.createMarathon.id },
        });
      }
    },
  });

  return { formApi: Form };
}
