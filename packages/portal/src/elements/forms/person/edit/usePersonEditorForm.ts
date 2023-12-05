import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { DbRole, MembershipPositionType } from "@ukdanceblue/common";
import type {
  DocumentType,
  FragmentType,
} from "@ukdanceblue/common/graphql-client-admin";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-admin";
import { type SetPersonInput } from "@ukdanceblue/common/graphql-client-admin/raw-types";
import { useMutation } from "urql";

import { PersonEditorFragment, personEditorDocument } from "./PersonEditorGQL";

export function usePersonEditorForm(
  personFragment: FragmentType<typeof PersonEditorFragment> | undefined | null,
  afterSubmit:
    | ((
        ret: DocumentType<typeof personEditorDocument>["setPerson"] | undefined
      ) => void | Promise<void>)
    | undefined
) {
  const personData = getFragmentData(PersonEditorFragment, personFragment);

  // Form
  const [{ fetching, error }, setPerson] = useMutation(personEditorDocument);
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving person...",
  });

  const Form = useForm<SetPersonInput>({
    defaultValues: {
      name: personData?.name ?? "",
      linkblue: personData?.linkblue ?? "",
      email: personData?.email ?? "",
      role: {
        dbRole: personData?.role.dbRole ?? DbRole.Public,
        committeeRole: personData?.role.committeeRole ?? null,
        committeeIdentifier: personData?.role.committeeIdentifier ?? null,
      },
      captainOf:
        personData?.teams
          .filter(
            (membership) =>
              membership.position === MembershipPositionType.Captain
          )
          .map((membership) => membership.team.uuid) ?? [],
      memberOf:
        personData?.teams
          .filter(
            (membership) =>
              membership.position === MembershipPositionType.Member
          )
          .map((membership) => membership.team.uuid) ?? [],
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
      if (!personData) {
        return;
      }

      if (!values.email) {
        throw new Error("Email is required");
      }

      let dbRole: DbRole = values.role?.dbRole ?? DbRole.Public;
      if (values.role?.committeeRole != null) {
        dbRole = DbRole.Committee;
      } else if ((values.captainOf?.length ?? 0) > 0) {
        dbRole = DbRole.TeamCaptain;
      } else if ((values.memberOf?.length ?? 0) > 0) {
        dbRole = DbRole.TeamMember;
      }

      const { data } = await setPerson({
        uuid: personData.uuid,
        input: {
          name: values.name || null,
          linkblue: values.linkblue || null,
          email: values.email,
          role: {
            dbRole,
            committeeRole: values.role?.committeeRole ?? null,
            committeeIdentifier: values.role?.committeeIdentifier ?? null,
          },
          captainOf: values.captainOf ?? [],
          memberOf: values.memberOf ?? [],
        },
      });

      return afterSubmit?.(data?.setPerson);
    },
  });

  return {
    formApi: Form,
  };
}
