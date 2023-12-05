import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { DbRole } from "@ukdanceblue/common";
import type { DocumentType } from "@ukdanceblue/common/graphql-client-admin";
import { type CreatePersonInput } from "@ukdanceblue/common/graphql-client-admin/raw-types";
import { useMutation } from "urql";

import { personCreatorDocument } from "./PersonCreatorGQL";

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
      role: {
        dbRole: DbRole.None,
        committeeRole: null,
        committeeIdentifier: null,
      },
      captainOf: [],
      memberOf: [],
    },
    onChange: (values) => {
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

      if (values.role?.committeeIdentifier && !values.role.committeeRole) {
        return "Committee role is required if a committee is selected";
      }

      return undefined;
    },
    onSubmit: async (values) => {
      if (!values.email) {
        throw new Error("Email is required");
      }

      const { data } = await createPerson({
        input: {
          name: values.name || null,
          linkblue: values.linkblue || null,
          email: values.email,
          role: {
            dbRole: values.role?.dbRole ?? DbRole.None,
            committeeRole: values.role?.committeeRole ?? null,
            committeeIdentifier: values.role?.committeeIdentifier ?? null,
          },
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
