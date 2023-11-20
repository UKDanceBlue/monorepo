import { CommitteeRole, committeeNames } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-admin";
import { App, Button, Empty, Flex, Form, Input, Select } from "antd";
import type { UseQueryExecute } from "urql";

import { TeamNameFragment } from "../PersonFormsGQL";

import { BaseOptionType } from "antd/es/select";
import { useMemo, useState } from "react";
import { PersonEditorFragment } from "./PersonEditorGQL";
import { usePersonEditorForm } from "./usePersonEditorForm";

export function PersonEditor({
  personFragment,
  teamNamesFragment,
  refetchPerson,
}: {
  personFragment?: FragmentType<typeof PersonEditorFragment> | undefined;
  teamNamesFragment?:
    | readonly FragmentType<typeof TeamNameFragment>[]
    | undefined;
  refetchPerson?: UseQueryExecute | undefined;
}) {
  const { message } = App.useApp();

  const { formApi } = usePersonEditorForm(personFragment, () => {
    if (refetchPerson) {
      refetchPerson({ requestPolicy: "network-only" });
    }
  });

  const teamNamesData = getFragmentData(TeamNameFragment, teamNamesFragment);

  const [formMemberOf, setFormMemberOf] = useState<readonly string[]>(
    formApi.getFieldValue("memberOf") ?? []
  );
  const [formCaptainOf, setFormCaptainOf] = useState<readonly string[]>(
    formApi.getFieldValue("captainOf") ?? []
  );
  type OptionType = BaseOptionType & { label: string; value: string };

  const { membershipOptions, captaincyOptions } = useMemo<{
    membershipOptions: OptionType[];
    captaincyOptions: OptionType[];
  }>(() => {
    const captaincyOptions: OptionType[] = [];
    const membershipOptions: OptionType[] = [];
    for (const team of teamNamesData ?? []) {
      captaincyOptions.push({
        label: team.name,
        value: team.uuid,
        disabled: formMemberOf.includes(team.uuid),
      });
      membershipOptions.push({
        label: team.name,
        value: team.uuid,
        disabled: formCaptainOf.includes(team.uuid),
      });
    }
    return { captaincyOptions, membershipOptions };
  }, [formCaptainOf, formMemberOf, teamNamesData]);

  const personData = getFragmentData(PersonEditorFragment, personFragment);

  if (!personData) {
    return (
      <Empty description="Person not found" style={{ marginTop: "1em" }} />
    );
  }
  if (!teamNamesFragment) {
    return (
      <Empty
        description="Could not load the list of teams"
        style={{ marginTop: "1em" }}
      />
    );
  }

  return (
    <Flex vertical gap="middle" align="center">
      <formApi.Provider>
        <Form
          onFinish={() => {
            formApi.handleSubmit().catch((error) => {
              if (error instanceof Error) {
                void message.error(error.message);
              } else {
                void message.error("An unknown error occurred");
              }
            });
          }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 32 }}
          style={{ minWidth: "25%" }}
        >
          <formApi.Subscribe selector={(state) => state.values.captainOf}>
            {(captainOf) => {
              setFormCaptainOf(captainOf ?? []);
              return null;
            }}
          </formApi.Subscribe>
          <formApi.Subscribe selector={(state) => state.values.memberOf}>
            {(memberOf) => {
              setFormMemberOf(memberOf ?? []);
              return null;
            }}
          </formApi.Subscribe>
          <formApi.Field name="name">
            {(field) => (
              <Form.Item
                label="Name"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
                help={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              >
                <Input
                  status={field.state.meta.errors.length > 0 ? "error" : ""}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Form.Item>
            )}
          </formApi.Field>
          <formApi.Field
            name="linkblue"
            onChange={(linkblue) =>
              (linkblue ?? "").endsWith("@uky.edu")
                ? "A LinkBlue looks like 'abcd123', not 'abcd123@uky.edu'"
                : undefined
            }
          >
            {(field) => (
              <Form.Item
                label="Linkblue"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
                help={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              >
                <Input
                  status={field.state.meta.errors.length > 0 ? "error" : ""}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Form.Item>
            )}
          </formApi.Field>
          <formApi.Field
            name="email"
            onChange={(value) => (!value ? "Email is required" : undefined)}
            children={(field) => (
              <Form.Item
                label="Email"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
                help={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              >
                <Input
                  status={field.state.meta.errors.length > 0 ? "error" : ""}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Form.Item>
            )}
          />
          <formApi.Field
            name="role.committeeRole"
            children={(field) => (
              <Form.Item
                label="Committee Role"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
                help={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              >
                <Select
                  status={field.state.meta.errors.length > 0 ? "error" : ""}
                  options={[
                    { label: "None", value: "" },
                    { label: "Chair", value: CommitteeRole.Chair },
                    { label: "Coordinator", value: CommitteeRole.Coordinator },
                    { label: "Member", value: CommitteeRole.Member },
                  ]}
                  value={field.state.value ?? ("" as const)}
                  onBlur={field.handleBlur}
                  onChange={(value) =>
                    field.handleChange(value === "" ? null : value)
                  }
                  filterOption={(input, option) =>
                    option?.label.toLowerCase().includes(input.toLowerCase()) ??
                    false
                  }
                />
              </Form.Item>
            )}
          />
          <formApi.Field
            name="role.committeeIdentifier"
            children={(field) => (
              <Form.Item
                label="Committee Identifier"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
                help={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              >
                <Select
                  status={field.state.meta.errors.length > 0 ? "error" : ""}
                  value={field.state.value ?? ("" as const)}
                  onBlur={field.handleBlur}
                  onChange={(value) =>
                    field.handleChange(value === "" ? null : value)
                  }
                  options={[
                    {
                      label: "None",
                      value: "",
                    },
                    ...Object.entries(committeeNames).map(([value, label]) => ({
                      label,
                      value,
                    })),
                  ]}
                  filterOption={(input, option) =>
                    option?.label.toLowerCase().includes(input.toLowerCase()) ??
                    false
                  }
                />
              </Form.Item>
            )}
          />
          <p>
            Note: If someone is captain of a team that also means they are a
            member of that team, so you don't need to select both.
          </p>
          <formApi.Field
            name="captainOf"
            children={(field) => (
              <Form.Item
                label="Captain Of"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
                help={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              >
                <Select
                  mode="multiple"
                  status={field.state.meta.errors.length > 0 ? "error" : ""}
                  value={field.state.value ?? null}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                  options={captaincyOptions}
                  filterOption={(input, option) =>
                    option?.label.toLowerCase().includes(input.toLowerCase()) ??
                    false
                  }
                />
              </Form.Item>
            )}
          />
          <formApi.Field
            name="memberOf"
            children={(field) => (
              <Form.Item
                label="Member Of"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
                help={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              >
                <Select
                  mode="multiple"
                  status={field.state.meta.errors.length > 0 ? "error" : ""}
                  value={field.state.value ?? null}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                  options={membershipOptions}
                  filterOption={(input, option) =>
                    option?.label.toLowerCase().includes(input.toLowerCase()) ??
                    false
                  }
                />
              </Form.Item>
            )}
          />
          <Form.Item wrapperCol={{ span: 32, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </formApi.Provider>
    </Flex>
  );
}
