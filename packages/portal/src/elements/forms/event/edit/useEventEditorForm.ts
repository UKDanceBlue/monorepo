import { useForm } from "@tanstack/react-form";
import { intervalFromSomething } from "@ukdanceblue/common";
import type { Interval } from "luxon";
import type { UseQueryExecute } from "urql";
import { useMutation } from "urql";

import type {
  SetEventInput,
  SetEventOccurrenceInput,
} from "#graphql/graphql.js";
import type { FragmentType } from "#graphql/index.js";
import { getFragmentData } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher";

import { eventEditorDocument,EventEditorFragment } from "./EventEditorGQL";

export function useEventEditorForm(
  eventFragment: FragmentType<typeof EventEditorFragment> | undefined,
  refetchEvent: UseQueryExecute | undefined
) {
  const eventData = getFragmentData(EventEditorFragment, eventFragment);

  // Form
  const [{ fetching, error }, setEvent] = useMutation(eventEditorDocument);
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
      title: eventData?.title ?? "",
      // Logical OR is intentional, we we want to replace empty strings with nulls
      summary: eventData?.summary || null,
      location: eventData?.location || null,
      description: eventData?.description || null,
      occurrences:
        eventData?.occurrences.map((occurrence) => ({
          uuid: occurrence.id,
          interval: intervalFromSomething(occurrence.interval),
          fullDay: occurrence.fullDay,
        })) ?? [],
    },
    onSubmit: async ({ value: values }) => {
      if (!eventData) {
        return;
      }

      await setEvent({
        uuid: eventData.id,
        input: {
          title: values.title,
          summary: values.summary ?? eventData.summary ?? null,
          location: values.location ?? eventData.location ?? null,
          description: values.description ?? eventData.description ?? null,
          occurrences: values.occurrences.map((occurrence) => {
            let retVal: Parameters<
              typeof setEvent
            >[0]["input"]["occurrences"][number] = {
              interval: {
                start: occurrence.interval.start!.toISO(),
                end: occurrence.interval.end!.toISO(),
              },
              fullDay: occurrence.fullDay,
            };
            if (occurrence.uuid) {
              retVal = {
                ...retVal,
                uuid: occurrence.uuid,
              };
            }
            return retVal;
          }),
        },
      });

      refetchEvent?.();
    },
  });

  return { formApi: Form };
}
