import { createNotificationDocument } from "./CreateNotificationGQL";

import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "urql";

import type { TeamType } from "@ukdanceblue/common";
import type { DocumentType } from "@ukdanceblue/common/graphql-client-portal";

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
          all?: never;
          memberOfTeamType?: TeamType;
          memberOfTeams?: string[];
          users?: string[];
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
        audience: values.audience,
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
