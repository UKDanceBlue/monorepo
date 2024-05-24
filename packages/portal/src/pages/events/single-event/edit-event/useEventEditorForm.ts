import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-admin";
import type {
  SetEventInput,
  SetEventOccurrenceInput,
} from "@ukdanceblue/common/graphql-client-admin/raw-types";
import { Interval } from "luxon";
import type { UseQueryExecute } from "urql";
import { useMutation } from "urql";

import { EventEditorFragment, eventEditorDocument } from "./EventEditorGQL";

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
          uuid: occurrence.uuid,
          interval: Interval.fromISO(occurrence.interval),
          fullDay: occurrence.fullDay,
        })) ?? [],
    },
    onSubmit: async (values) => {
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
              interval: occurrence.interval.toISO(),
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
