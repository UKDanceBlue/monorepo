import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import type { DocumentType } from "@ukdanceblue/common/graphql-client-admin";
import { useMutation } from "urql";

import { createNotificationDocument } from "./CreateNotificationGQL";

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
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving person...",
  });

  const Form = useForm<{
    title: string;
    body: string;
    audience: {
      // TODO: implement audience selection
      all: true;
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
    onChange: (_values) => {
      return undefined;
    },
    onSubmit: async (values) => {
      if (!values.title) {
        throw new Error("Title is required");
      } else if (!values.body) {
        throw new Error("Body is required");
      } else if ((values.audience.all as unknown) !== true) {
        throw new Error("Audience selection is not yet implemented");
      } else if (values.url) {
        try {
          new URL(values.url);
        } catch {
          throw new Error("Invalid URL");
        }
      }

      const { data } = await createNotification({
        title: values.title,
        body: values.body,
        audience: values.audience,
        url: values.url,
      });

      return afterSubmit?.(data?.stageNotification);
    },
  });

  return {
    formApi: Form,
  };
}
