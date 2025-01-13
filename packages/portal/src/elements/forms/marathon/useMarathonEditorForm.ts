import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { dateTimeFromSomething } from "@ukdanceblue/common";
import type { DateTime } from "luxon";
import { useMutation, useQuery } from "urql";

import { graphql } from "#gql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

export function useMarathonCreatorForm({ marathonId }: { marathonId: string }) {
  // Form
  const [{ fetching: editFetching, error: editError }, editMarathon] =
    useMutation(
      graphql(/* GraphQL */ `
        mutation EditMarathon(
          $input: SetMarathonInput!
          $marathonId: GlobalId!
        ) {
          setMarathon(input: $input, id: $marathonId) {
            id
          }
        }
      `)
    );

  const { resetWatcher: resetEditWatcher } = useQueryStatusWatcher({
    error: editError,
    fetching: editFetching,
    loadingMessage: "Saving marathon...",
  });

  const [
    { data: existingData, fetching: existingFetching, error: existingError },
  ] = useQuery({
    query: graphql(/* GraphQL */ `
      query GetMarathon($marathonId: GlobalId!) {
        marathon(id: $marathonId) {
          year
          startDate
          endDate
        }
      }
    `),
    variables: { marathonId },
  });

  const { resetWatcher: resetExistingWatcher } = useQueryStatusWatcher({
    error: existingError,
    fetching: existingFetching,
    loadingMessage: "Loading existing marathon...",
  });

  const navigate = useNavigate();

  const Form = useForm<{
    year: string | undefined;
    startDate: DateTime | undefined;
    endDate: DateTime | undefined;
  }>({
    defaultValues: {
      year: existingData?.marathon.year,
      startDate:
        dateTimeFromSomething(existingData?.marathon.startDate) ?? undefined,
      endDate:
        dateTimeFromSomething(existingData?.marathon.endDate) ?? undefined,
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
        !values.startDate ||
        !values.endDate ||
        !values.startDate.isValid ||
        !values.endDate.isValid
      ) {
        return;
      }

      const { data } = await editMarathon({
        input: {
          year: values.year,
          startDate: values.startDate
            .set({ minute: 0, second: 0, millisecond: 0 })
            .toISO()!,
          endDate: values.endDate
            .set({ minute: 0, second: 0, millisecond: 0 })
            .toISO()!,
        },
        marathonId,
      });

      if (data) {
        resetEditWatcher();
        resetExistingWatcher();
        await navigate({
          to: "/marathon/$marathonId",
          params: { marathonId: data.setMarathon.id },
        });
      }
    },
  });

  return { formApi: Form };
}
