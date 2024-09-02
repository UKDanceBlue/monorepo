import { PersonEditorFragment, personEditorDocument } from "./PersonEditorGQL";

import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { MembershipPositionType } from "@ukdanceblue/common";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-portal";
import { type MemberOf } from "@ukdanceblue/common/graphql-client-portal/raw-types";
import { useMutation } from "urql";

import type {
  DocumentType,
  FragmentType,
} from "@ukdanceblue/common/graphql-client-portal";

export function usePersonEditorForm(
  personFragment: FragmentType<typeof PersonEditorFragment> | undefined | null,
  afterSubmit:
    | ((
        ret: DocumentType<typeof personEditorDocument>["setPerson"] | undefined
      ) => void | Promise<void>)
    | undefined
) {
  const personData = getFragmentData(PersonEditorFragment, personFragment);
  console.log(personData);

  // Form
  const [{ fetching, error }, setPerson] = useMutation(personEditorDocument);
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving person...",
  });

  // TODO: Show the user what year the marathon is for each team

  const Form = useForm<{
    readonly name?: string;
    readonly linkblue?: string;
    readonly email?: string;
    readonly captainOf?: MemberOf[];
    readonly memberOf?: MemberOf[];
  }>({
    defaultValues: {
      name: personData?.name ?? "",
      linkblue: personData?.linkblue ?? "",
      email: personData?.email ?? "",
      captainOf:
        personData?.teams
          .filter(
            (membership) =>
              membership.position === MembershipPositionType.Captain
          )
          .map((membership) => ({
            id: membership.team.id,
            committeeRole: membership.committeeRole,
          })) ?? [],
      memberOf:
        personData?.teams
          .filter(
            (membership) =>
              membership.position === MembershipPositionType.Member
          )
          .map((membership) => ({
            id: membership.team.id,
            committeeRole: membership.committeeRole,
          })) ?? [],
    },
    validators: {
      onChange: ({ value: values }) => {
        const memberOfCount: Record<string, number> = {};
        for (const { id: uuid } of values.memberOf ?? []) {
          memberOfCount[uuid] = (memberOfCount[uuid] ?? 0) + 1;
        }
        const captainOfCount: Record<string, number> = {};
        for (const { id: uuid } of values.captainOf ?? []) {
          captainOfCount[uuid] = (captainOfCount[uuid] ?? 0) + 1;
        }

        for (const uuid in memberOfCount) {
          if ((memberOfCount[uuid] ?? 0) > 1) {
            return "Cannot be a member of a team more than once";
          }
        }
        for (const uuid in captainOfCount) {
          if ((captainOfCount[uuid] ?? 0) > 1) {
            return "Cannot be a captain of a team more than once";
          }
        }

        for (const { id: uuid } of values.memberOf ?? []) {
          if (values.captainOf?.some((team) => team.id === uuid)) {
            return "Cannot be a captain and member of a team";
          }
        }

        return undefined;
      },
    },
    onSubmit: async ({ value: values }) => {
      if (!personData) {
        return;
      }

      if (!values.email) {
        throw new Error("Email is required");
      }

      const { data } = await setPerson({
        uuid: personData.id,
        input: {
          name: values.name || null,
          linkblue: values.linkblue || null,
          email: values.email,
          captainOf: (values.captainOf ?? []).map(({ id, committeeRole }) => ({
            id,
            committeeRole,
          })),
          memberOf: (values.memberOf ?? []).map(({ id, committeeRole }) => ({
            id,
            committeeRole,
          })),
        },
      });

      return afterSubmit?.(data?.setPerson);
    },
  });

  return {
    formApi: Form,
  };
}
