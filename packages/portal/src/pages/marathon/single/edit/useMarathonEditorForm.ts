import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { dateTimeFromSomething } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import type { DateTime } from "luxon";
import { useMutation, useQuery } from "urql";

export function useMarathonCreatorForm({ marathonId }: { marathonId: string }) {
  // Form
  const [{ fetching: editFetching, error: editError }, editMarathon] =
    useMutation(
      graphql(/* GraphQL */ `
        mutation EditMarathon($input: SetMarathonInput!, $marathonId: String!) {
          setMarathon(input: $input, uuid: $marathonId) {
            uuid
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
      query GetMarathon($marathonId: String!) {
        marathon(uuid: $marathonId) {
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
      startDate: dateTimeFromSomething(existingData?.marathon.startDate),
      endDate: dateTimeFromSomething(existingData?.marathon.endDate),
    },
    onChange: ({ startDate, endDate }) => {
      if (startDate && endDate && startDate.toMillis() > endDate.toMillis()) {
        return "Start date must be before end date";
      }

      return undefined;
    },
    onSubmit: async (values) => {
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
          to: "/marathon/$marathonId/",
          params: { marathonId: data.setMarathon.uuid },
        });
      }
    },
  });

  return { formApi: Form };
}
