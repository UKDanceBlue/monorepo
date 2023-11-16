import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useForm } from "@tanstack/react-form";
import { DbRole, MembershipPositionType } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-admin";
import { type SetPersonInput } from "@ukdanceblue/common/graphql-client-admin/raw-types";
import type { UseQueryExecute } from "urql";
import { useMutation } from "urql";

import { PersonEditorFragment, personEditorDocument } from "./PersonEditorGQL";

export function usePersonEditorForm(
  personFragment: FragmentType<typeof PersonEditorFragment> | undefined,
  refetchPerson: UseQueryExecute | undefined
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

      refetchPerson?.();
    },
  });

  return { formApi: Form };
}
