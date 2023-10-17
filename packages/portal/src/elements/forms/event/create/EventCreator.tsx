import { useMutation } from "@apollo/client";
import { useApolloStatusWatcher } from "@hooks/useApolloStatusWatcher";
import { CREATE_EVENT } from "@mutations/eventMutations";
import { LIST_EVENTS } from "@queries/eventQueries";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import type { CreateEventInput } from "@ukdanceblue/common/graphql-client-admin/raw-types";
import { Input } from "antd";

export function EventCreator() {
  const [createEvent, { loading, error }] = useMutation(CREATE_EVENT, {
    refetchQueries: [LIST_EVENTS],
    notifyOnNetworkStatusChange: true,
  });

  useApolloStatusWatcher({
    error,
    loadingMessage: loading ? "Creating event..." : undefined,
  });

  const navigate = useNavigate();

  const form = useForm<CreateEventInput>({
    async onSubmit(values, formApi) {
      const createdEvent = await createEvent({
        variables: {
          input: values,
        },
      });

      if (createdEvent.data?.createEvent.ok) {
        await navigate({
          to: "/events/$eventId",
          params: { eventId: createdEvent.data.createEvent.data.uuid },
        });
      }
    },
  });

  return (
    <form.Provider>
      <form.Field
        name="title"
        children={(field) => (
          <input
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      />
      <form.Field
        name="summary"
        children={(field) => (
          <Input
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      />
      <form.Field
        name="duration"
        children={(field) => (
          <Input
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      />
      <form.Field
        name="description"
        children={(field) => (
          <Input.TextArea
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      />
    </form.Provider>
  );
}
