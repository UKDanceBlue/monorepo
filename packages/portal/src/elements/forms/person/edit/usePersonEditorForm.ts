import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { DbRole, MembershipPositionType } from "@ukdanceblue/common";
import type {
  DocumentType,
  FragmentType,
} from "@ukdanceblue/common/graphql-client-admin";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-admin";
import { type SetPersonInput } from "@ukdanceblue/common/graphql-client-admin/raw-types";
import type { BaseOptionType } from "antd/es/select";
import isEqual from "lodash.isequal";
import { useMemo, useRef } from "react";
import { useMutation } from "urql";

import { TeamNameFragment } from "../PersonFormsGQL";

import { PersonEditorFragment, personEditorDocument } from "./PersonEditorGQL";

export function usePersonEditorForm(
  personFragment: FragmentType<typeof PersonEditorFragment> | undefined,
  teamNamesFragment:
    | readonly FragmentType<typeof TeamNameFragment>[]
    | undefined,
  afterSubmit:
    | ((
        ret: DocumentType<typeof personEditorDocument>["setPerson"] | undefined
      ) => void | Promise<void>)
    | undefined
) {
  const personData = getFragmentData(PersonEditorFragment, personFragment);
  const teamNamesData = getFragmentData(TeamNameFragment, teamNamesFragment);

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

  type OptionType = BaseOptionType & { label: string; value: string };
  const formMemberOf = Form.getFieldValue("memberOf");
  const formCaptainOf = Form.getFieldValue("captainOf");
  const oldTeamNamesData = useRef(teamNamesData);
  const oldFormMemberOf = useRef(formMemberOf);
  const oldFormCaptainOf = useRef(formCaptainOf);
  const oldMembershipOptions = useRef<OptionType[]>([]);
  const oldCaptaincyOptions = useRef<OptionType[]>([]);
  const { membershipOptions, captaincyOptions } = useMemo<{
    membershipOptions: OptionType[];
    captaincyOptions: OptionType[];
  }>(() => {
    if (
      !isEqual(oldFormMemberOf.current, formMemberOf) ||
      !isEqual(oldFormCaptainOf.current, formCaptainOf) ||
      teamNamesData !== oldTeamNamesData.current
    ) {
      const memberOfArray = formMemberOf ?? [];
      const captainOfArray = formCaptainOf ?? [];
      const captaincyOptions: OptionType[] = [];
      const membershipOptions: OptionType[] = [];
      for (const team of teamNamesData ?? []) {
        captaincyOptions.push({
          label: team.name,
          value: team.uuid,
          disabled: memberOfArray.includes(team.uuid),
        });
        membershipOptions.push({
          label: team.name,
          value: team.uuid,
          disabled: captainOfArray.includes(team.uuid),
        });
      }
      oldFormMemberOf.current = formMemberOf;
      oldFormCaptainOf.current = formCaptainOf;
      oldTeamNamesData.current = teamNamesData;
      oldCaptaincyOptions.current = captaincyOptions;
      oldMembershipOptions.current = membershipOptions;
      return { captaincyOptions, membershipOptions };
    } else {
      return {
        captaincyOptions: oldCaptaincyOptions.current,
        membershipOptions: oldMembershipOptions.current,
      };
    }
  }, [formCaptainOf, formMemberOf, teamNamesData]);

  return {
    formApi: Form,
    captaincyOptions,
    membershipOptions,
  };
}
