import { personCreatorDocument } from "./PersonCreatorGQL";

import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { type CreatePersonInput } from "@ukdanceblue/common/graphql-client-portal/raw-types";
import { useMutation } from "urql";

import type { DocumentType } from "@ukdanceblue/common/graphql-client-portal";

export function usePersonCreatorForm(
  afterSubmit:
    | ((
        ret:
          | DocumentType<typeof personCreatorDocument>["createPerson"]
          | undefined
      ) => void | Promise<void>)
    | undefined
) {
  // Form
  const [{ fetching, error }, createPerson] = useMutation(
    personCreatorDocument
  );
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving person...",
  });

  const Form = useForm<CreatePersonInput>({
    defaultValues: {
      name: "",
      linkblue: "",
      email: "",
      captainOf: [],
      memberOf: [],
    },
    validators: {
      onChange: ({ value: values }) => {
        const memberOfCount: Record<string, number> = {};
        for (const uuid of values.memberOf ?? []) {
          memberOfCount[uuid] = (memberOfCount[uuid] ?? 0) + 1;
        }
        const captainOfCount: Record<string, number> = {};
        for (const uuid of values.captainOf ?? []) {
          captainOfCount[uuid] = (captainOfCount[uuid] ?? 0) + 1;
        }

        for (const uuid of Object.keys(memberOfCount)) {
          if ((memberOfCount[uuid] ?? 0) > 1) {
            return "Cannot be a member of a team more than once";
          }
        }
        for (const uuid of Object.keys(captainOfCount)) {
          if ((captainOfCount[uuid] ?? 0) > 1) {
            return "Cannot be a captain of a team more than once";
          }
        }

        for (const uuid of values.memberOf ?? []) {
          if (values.captainOf?.includes(uuid)) {
            return "Cannot be a captain and member of a team";
          }
        }

        return undefined;
      },
    },
    onSubmit: async ({ value: values }) => {
      if (!values.email) {
        throw new Error("Email is required");
      }

      const { data } = await createPerson({
        input: {
          name: values.name || null,
          linkblue: values.linkblue || null,
          email: values.email,
          captainOf: values.captainOf ?? [],
          memberOf: values.memberOf ?? [],
        },
      });

      return afterSubmit?.(data?.createPerson);
    },
  });

  return {
    formApi: Form,
  };
}
