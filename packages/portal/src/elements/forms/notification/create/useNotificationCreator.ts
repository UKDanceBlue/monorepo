import { useForm } from "@tanstack/react-form";
import type { TeamType } from "@ukdanceblue/common";
import { useMutation } from "urql";

import type { DocumentType } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

import { createNotificationDocument } from "../../../../documents/notification.js";

export function useNotificationCreator(
  afterSubmit:
    | ((
        ret:
          | DocumentType<typeof createNotificationDocument>["stageNotification"]
          | undefined
      ) => void | Promise<void>)
    | undefined
) {
  // Form
  const [{ fetching, error }, createNotification] = useMutation(
    createNotificationDocument
  );
  const { resetWatcher } = useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving notification...",
  });

  const Form = useForm<{
    title: string;
    body: string;
    audience:
      | {
          all: true;
          memberOfTeamType?: never;
          memberOfTeams?: never;
          users?: never;
        }
      | {
          all?: false | undefined;
          memberOfTeamType?: TeamType;
          memberOfTeams?: string[];
          users?: {
            name: string | undefined;
            id: string;
            linkblue: string | undefined;
          }[];
        };
    url?: string;
  }>({
    defaultValues: {
      title: "",
      body: "",
      audience: {
        all: true,
      },
      url: "",
    },
    validators: {
      onChange: () => {
        return undefined;
      },
    },
    onSubmit: async ({ value: values }) => {
      if (!values.title) {
        throw new Error("Title is required");
      } else if (!values.body) {
        throw new Error("Body is required");
      } else if (values.url) {
        try {
          new URL(values.url);
        } catch {
          throw new Error("Invalid URL");
        }
      }

      if (
        !values.audience.all &&
        !values.audience.memberOfTeamType &&
        !values.audience.memberOfTeams?.length &&
        !values.audience.users?.length
      ) {
        throw new Error("Audience is required");
      }

      const { data } = await createNotification({
        title: values.title,
        body: values.body,
        audience: values.audience.all
          ? { all: true }
          : {
              memberOfTeams: values.audience.memberOfTeams,
              memberOfTeamType: values.audience.memberOfTeamType,
              users: values.audience.users?.map(({ id }) => id),
            },
        url: values.url,
      });

      resetWatcher();

      return afterSubmit?.(data?.stageNotification);
    },
  });

  return {
    formApi: Form,
  };
}
