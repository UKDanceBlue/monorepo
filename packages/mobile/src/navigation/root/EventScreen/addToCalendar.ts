import { EventScreenFragment } from "./EventScreenFragment";

import { universalCatch } from "@common/logging";
import { showMessage, showPrompt } from "@common/util/alertUtils";
import { discoverDefaultCalendar } from "@common/util/calendar";
import { intervalFromSomething } from "@ukdanceblue/common";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-mobile";
import {
  PermissionStatus,
  createEventAsync,
  getCalendarPermissionsAsync,
  requestCalendarPermissionsAsync,
} from "expo-calendar";

import type { FragmentType } from "@ukdanceblue/common/graphql-client-mobile";
import type { Event } from "expo-calendar";

export async function onAddToCalendar(
  event: FragmentType<typeof EventScreenFragment>,
  occurrenceId: string
) {
  const eventData = getFragmentData(EventScreenFragment, event);

  try {
    const permissionResponse = await getCalendarPermissionsAsync();
    let permissionStatus = permissionResponse.status;
    const { canAskAgain } = permissionResponse;

    if (permissionStatus === PermissionStatus.DENIED) {
      showMessage(
        "Go to your device settings to enable calendar access",
        "Calendar access denied"
      );
    } else if (
      permissionStatus === PermissionStatus.UNDETERMINED ||
      canAskAgain
    ) {
      permissionStatus = (await requestCalendarPermissionsAsync()).status;
    }

    if (permissionStatus === PermissionStatus.GRANTED) {
      const defaultCalendar = await discoverDefaultCalendar();
      if (defaultCalendar == null) {
        showMessage(undefined, "No calendar found");
      } else {
        const addAll = await new Promise<boolean>((resolve) => {
          showPrompt(
            "Would you like to add just this occurrence or all occurrences?",
            "Add to calendar",
            () => resolve(false),
            () => resolve(true),
            "Just this occurrence",
            "All occurrences"
          );
        });

        const expoEvents: Partial<Event>[] = [];

        const eventDataToExpoEvent = (
          occurrence: (typeof eventData.occurrences)[number]
        ): Partial<Event> => {
          const interval = intervalFromSomething(occurrence.interval);
          if (!interval.isValid) {
            throw new Error("Invalid interval");
          }
          return {
            title: eventData.title,
            allDay: occurrence.fullDay,
            notes: `${eventData.summary ?? ""}\n\n${
              eventData.description ?? ""
            }`,
            // TODO: fix these start and end dates - (are these already fixed? not sure)
            startDate: interval.start.toJSDate(),
            endDate: interval.end.toJSDate(),
            location: eventData.location ?? undefined,
            timeZone: interval.start.zoneName,
            endTimeZone: interval.end.zoneName,
            organizer: "UK DanceBlue",
            organizerEmail: "community@danceblue.org",
            id: `${eventData.id}:${occurrence.id}`,
          };
        };

        if (addAll) {
          expoEvents.push(...eventData.occurrences.map(eventDataToExpoEvent));
        } else {
          const occurrence = eventData.occurrences.find(
            (o) => o.id === occurrenceId
          );

          if (!occurrence) {
            showMessage("Occurrence could not be added to calendar", "Error");
            return;
          }

          expoEvents.push(eventDataToExpoEvent(occurrence));
        }

        await Promise.all(
          expoEvents.map((e) => createEventAsync(defaultCalendar.id, e))
        );

        showMessage(undefined, "Event created");
      }
    }
  } catch (error) {
    universalCatch(error);
  }
}
