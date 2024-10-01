import { eventCreatorDocument } from "./EventCreatorGQL";

import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "urql";

import type {
  SetEventInput,
  SetEventOccurrenceInput,
} from "@graphql/raw-types";
import type { Interval } from "luxon";

export function useEventCreatorForm() {
  // Form
  const [{ fetching, error }, createEvent] = useMutation(eventCreatorDocument);
  const navigate = useNavigate();
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving event...",
  });

  const Form = useForm<
    Omit<SetEventInput, "occurrences"> & {
      occurrences: (Omit<SetEventOccurrenceInput, "uuid" | "interval"> & {
        uuid?: string;
        interval: Interval;
      })[];
    }
  >({
    defaultValues: {
      title: "",
      // Logical OR is intentional, we we want to replace empty strings with nulls
      summary: null,
      location: null,
      description: null,
      occurrences: [],
    },
    onSubmit: async ({ value: values }) => {
      const { data } = await createEvent({
        input: {
          title: values.title,
          summary: values.summary ?? null,
          location: values.location ?? null,
          description: values.description ?? null,
          occurrences: values.occurrences.map((occurrence) => {
            const retVal: Parameters<
              typeof createEvent
            >[0]["input"]["occurrences"][number] = {
              interval: {
                start: occurrence.interval.start!.toISO(),
                end: occurrence.interval.end!.toISO(),
              },
              fullDay: occurrence.fullDay,
            };
            return retVal;
          }),
        },
      });

      if (data) {
        await navigate({
          to: "/events",
        });
      }
    },
  });

  return { formApi: Form };
}
