import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { DbRole } from "@ukdanceblue/common";
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

import { personCreatorDocument } from "./PersonCreatorGQL";

export function usePersonCreatorForm(
  teamNamesFragment:
    | readonly FragmentType<typeof TeamNameFragment>[]
    | undefined,
  afterSubmit:
    | ((
        ret:
          | DocumentType<typeof personCreatorDocument>["createPerson"]
          | undefined
      ) => void | Promise<void>)
    | undefined
) {
  const teamNamesData = getFragmentData(TeamNameFragment, teamNamesFragment);

  // Form
  const [{ fetching, error }, createPerson] = useMutation(
    personCreatorDocument
  );
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Saving person...",
  });

  const Form = useForm<SetPersonInput>({
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
