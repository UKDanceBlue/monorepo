import { useForm } from "@tanstack/react-form";
import { MembershipPositionType } from "@ukdanceblue/common";
import { useMutation } from "urql";

import { type MemberOf } from "#graphql/graphql.js";
import type { DocumentType, FragmentType } from "#graphql/index.js";
import { getFragmentData } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

import {
  fundraisingEntryEditorDocument,
  FundraisingEntryEditorFragment,
} from "../../../../documents/fundriaisngEntry.js";

export function useFundraisingEntryEditorForm(
  fundraisingEntryFragment:
    | FragmentType<typeof FundraisingEntryEditorFragment>
    | undefined
    | null,
  afterSubmit:
    | ((
        ret:
          | DocumentType<
              typeof fundraisingEntryEditorDocument
            >["setFundraisingEntry"]
          | undefined
      ) => void | Promise<void>)
    | undefined
) {
  const fundraisingEntryData = getFragmentData(
    FundraisingEntryEditorFragment,
    fundraisingEntryFragment
  );

  // Form
  const [{ fetching, error }, setFundraisingEntry] = useMutation(
    fundraisingEntryEditorDocument
  );
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving fundraisingEntry...",
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
      name: fundraisingEntryData?.name ?? "",
      linkblue: fundraisingEntryData?.linkblue?.toLowerCase() ?? "",
      email: fundraisingEntryData?.email ?? "",
      captainOf:
        fundraisingEntryData?.teams
          .filter(
            (membership) =>
              membership.position === MembershipPositionType.Captain
          )
          .map((membership) => ({
            id: membership.team.id,
            committeeRole: membership.committeeRole,
          })) ?? [],
      memberOf:
        fundraisingEntryData?.teams
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
      if (!fundraisingEntryData) {
        return;
      }

      if (!values.email) {
        throw new Error("Email is required");
      }

      const { data } = await setFundraisingEntry({
        uuid: fundraisingEntryData.id,
        input: {
          name: values.name || null,

          linkblue: values.linkblue?.toLowerCase() || null,
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

      return afterSubmit?.(data?.setFundraisingEntry);
    },
  });

  return {
    formApi: Form,
  };
}
