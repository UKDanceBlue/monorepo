import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { DbRole, MembershipPositionType } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
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
  afterSubmit: (() => void | Promise<void>) | undefined
) {
  const personData = getFragmentData(PersonEditorFragment, personFragment);
  const teamNamesData = getFragmentData(TeamNameFragment, teamNamesFragment);
  // const [hasTeamNamesChanged, setHasTeamNamesChanged] = useState(true);
  // useEffect(() => {
  //   if (oldTeamNamesData.current !== teamNamesData) {
  //     oldTeamNamesData.current = teamNamesData;
  //     setHasTeamNamesChanged(true);
  //   }
  // }, [teamNamesData]);

  // const [captaincyOptions, setCaptaincyOptions] = useState<BaseOptionType[]>(
  //   []
  // );
  // const [membershipOptions, setMembershipOptions] = useState<BaseOptionType[]>(
  //   []
  // );

  // Form
  const [{ fetching, error }, setPerson] = useMutation(personEditorDocument);
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving person...",
  });

  // function updateTeamSelectOptions(values: SetPersonInput) {
  //   if (hasTeamNamesChanged) {
  //     const captaincyOptions: BaseOptionType[] = [];
  //     const membershipOptions: BaseOptionType[] = [];
  //     const memberOfArray = values.memberOf ?? [];
  //     const captainOfArray = values.captainOf ?? [];
  //     for (const team of teamNamesData ?? []) {
  //       captaincyOptions.push({
  //         label: team.name,
  //         value: team.uuid,
  //         disabled: memberOfArray.includes(team.uuid),
  //       });
  //       membershipOptions.push({
  //         label: team.name,
  //         value: team.uuid,
  //         disabled: captainOfArray.includes(team.uuid),
  //       });
  //     }
  //     setCaptaincyOptions(captaincyOptions);
  //     setMembershipOptions(membershipOptions);
  //     setHasTeamNamesChanged(false);
  //   }
  // }

  const Form = useForm<SetPersonInput>({
    defaultValues: {
      name: personData?.name ?? "",
      linkblue: personData?.linkblue ?? "",
      email: personData?.email ?? "",
      role: {
        dbRole: personData?.role.dbRole ?? DbRole.None,
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
      console.log("onChange");
      return undefined;
    },
    onSubmit: async (values) => {
      if (!personData) {
        return;
      }

      if (!values.email) {
        throw new Error("Email is required");
      }

      await setPerson({
        uuid: personData.uuid,
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

      return afterSubmit?.();
    },
  });

  const formMemberOf = Form.getFieldValue("memberOf");
  const formCaptainOf = Form.getFieldValue("captainOf");
  const oldTeamNamesData = useRef(teamNamesData);
  const oldFormMemberOf = useRef(formMemberOf);
  const oldFormCaptainOf = useRef(formCaptainOf);
  const oldMembershipOptions = useRef<BaseOptionType[]>([]);
  const oldCaptaincyOptions = useRef<BaseOptionType[]>([]);
  const { membershipOptions, captaincyOptions } = useMemo<{
    membershipOptions: BaseOptionType[];
    captaincyOptions: BaseOptionType[];
  }>(() => {
    console.log("useMemo");
    if (
      !isEqual(oldFormMemberOf.current, formMemberOf) ||
      !isEqual(oldFormCaptainOf.current, formCaptainOf) ||
      teamNamesData !== oldTeamNamesData.current
    ) {
      const memberOfArray = formMemberOf ?? [];
      const captainOfArray = formCaptainOf ?? [];
      const captaincyOptions: BaseOptionType[] = [];
      const membershipOptions: BaseOptionType[] = [];
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
