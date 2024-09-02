import { TanAntFormItem } from "@elements/components/form/TanAntFormItem";
import { useLoginState } from "@hooks/useLoginState";
import { AccessLevel, CommitteeRole } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-portal";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-portal";
import {
  App,
  AutoComplete,
  Button,
  Empty,
  Flex,
  Form,
  Input,
  List,
  Select,
  Typography,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import type { ReactNode } from "react";
import { useState } from "react";
import type { UseQueryExecute } from "urql";

import { TeamNameFragment } from "../PersonFormsGQL";
import { PersonEditorFragment } from "./PersonEditorGQL";
import { usePersonEditorForm } from "./usePersonEditorForm";

export function PersonEditor({
  personFragment,
  teamNamesFragment,
  refetchPerson,
}: {
  personFragment?: FragmentType<typeof PersonEditorFragment> | undefined | null;
  teamNamesFragment?:
    | readonly FragmentType<typeof TeamNameFragment>[]
    | undefined;
  refetchPerson?: UseQueryExecute | undefined;
}) {
  const { authorization } = useLoginState();
  const isAdmin =
    (authorization?.accessLevel ?? AccessLevel.None) >= AccessLevel.Admin;

  const { message } = App.useApp();

  const { formApi } = usePersonEditorForm(personFragment, () => {
    if (refetchPerson) {
      refetchPerson({ requestPolicy: "network-only" });
    }
  });

  const teamNamesData =
    getFragmentData(TeamNameFragment, teamNamesFragment) ?? [];

  const personData = getFragmentData(PersonEditorFragment, personFragment);

  const [captainSearch, setCaptainSearch] = useState("");
  const lowerCaptainSearch = captainSearch.toLowerCase();
  const captainOptions: ReactNode[] = [];
  for (const team of teamNamesData) {
    if (!team.name.toLowerCase().includes(lowerCaptainSearch)) continue;
    captainOptions.push(
      <AutoComplete.Option key={team.id} value={team.id}>
        {team.name}
      </AutoComplete.Option>
    );
  }

  const [membershipSearch, setMembershipSearch] = useState("");
  const lowerMembershipSearch = membershipSearch.toLowerCase();
  const membershipOptions: ReactNode[] = [];
  for (const team of teamNamesData) {
    if (!team.name.toLowerCase().includes(lowerMembershipSearch)) continue;
    membershipOptions.push(
      <AutoComplete.Option key={team.id} value={team.id}>
        {team.name}
      </AutoComplete.Option>
    );
  }

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
      <Form
        onFinish={() => {
          formApi.handleSubmit().catch((error: unknown) => {
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
        <Typography.Title level={4}>Personal Information</Typography.Title>
        <TanAntFormItem
          fieldProps={{
            validate: (value) => (!value ? "Name is required" : undefined),
          }}
          formApi={formApi}
          name="name"
          label="Name"
        >
          {({ value, onChange, onBlur, status }) => (
            <Input
              status={status}
              name="name"
              value={value ?? ""}
              onBlur={onBlur}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </TanAntFormItem>
        <TanAntFormItem
          fieldProps={{
            validate: (value) =>
              (value ?? "").includes("@")
                ? "A LinkBlue looks like 'abcd123', not 'abcd123@uky.edu'"
                : undefined,
          }}
          formApi={formApi}
          name="linkblue"
          label="Linkblue"
        >
          {({ value, onChange, onBlur, status }) => (
            <Input
              status={status}
              name="linkblue"
              value={value ?? ""}
              onBlur={onBlur}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </TanAntFormItem>
        <TanAntFormItem
          fieldProps={{
            validate: (value) => (!value ? "Email is required" : undefined),
          }}
          formApi={formApi}
          name="email"
          label="Email"
        >
          {({ value, onChange, onBlur, status }) => (
            <Input
              status={status}
              name="email"
              value={value ?? ""}
              onBlur={onBlur}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </TanAntFormItem>
        <Typography.Title level={4}>Teams</Typography.Title>
        <span>
          Note: If someone is captain of a team that also means they are a
          member of that team, so you don't need to select both.
        </span>
        <Typography.Title level={5}>Captain Of</Typography.Title>
        <formApi.Field
          name="captainOf"
          mode="array"
          children={(field) => (
            <>
              <List>
                {field.state.value?.map((team) => {
                  const { name, committeeIdentifier } =
                    teamNamesData.find((option) => option.id === team.id) ?? {};
                  return (
                    <List.Item key={team.id}>
                      {name ?? team.id}
                      {committeeIdentifier &&
                        (isAdmin ? (
                          <Select
                            value={team.committeeRole ?? null}
                            onChange={(value) =>
                              field.handleChange(
                                field.state.value?.map((val) =>
                                  val.id === team.id
                                    ? { ...val, committeeRole: value }
                                    : val
                                )
                              )
                            }
                            style={{ minWidth: "15ch", marginLeft: "1em" }}
                            title="Committee Role"
                          >
                            <Select.Option value={null}>{null}</Select.Option>
                            <Select.Option value={CommitteeRole.Member}>
                              Member
                            </Select.Option>
                            <Select.Option value={CommitteeRole.Coordinator}>
                              Coordinator
                            </Select.Option>
                            <Select.Option value={CommitteeRole.Chair}>
                              Chair
                            </Select.Option>
                          </Select>
                        ) : (
                          ` (${committeeIdentifier})`
                        ))}
                      <Button
                        onClick={() =>
                          field.removeValue(
                            field.state.value?.findIndex(
                              (val) => val.id === team.id
                            ) ?? 0
                          )
                        }
                        style={{ marginLeft: "1em" }}
                      >
                        Remove
                      </Button>
                    </List.Item>
                  );
                })}
              </List>
              <FormItem label="Add Captaincy">
                <AutoComplete
                  value={captainSearch}
                  onChange={(value) => setCaptainSearch(value)}
                  onSelect={(value: string) => {
                    field.pushValue({
                      id: value,
                      committeeRole: null,
                    });
                    setCaptainSearch("");
                  }}
                  style={{ minWidth: "15ch" }}
                >
                  {captainOptions}
                </AutoComplete>
              </FormItem>
            </>
          )}
        />
        <Typography.Title level={5}>Member Of</Typography.Title>
        <formApi.Field
          name="memberOf"
          mode="array"
          children={(field) => (
            <>
              <List>
                {field.state.value?.map((team) => {
                  const { name, committeeIdentifier } =
                    teamNamesData.find((option) => option.id === team.id) ?? {};
                  return (
                    <List.Item key={team.id}>
                      {name ?? team.id}
                      {committeeIdentifier &&
                        (isAdmin ? (
                          <Select
                            options={[
                              { label: "Member", value: CommitteeRole.Member },
                              {
                                label: "Coordinator",
                                value: CommitteeRole.Coordinator,
                              },
                              { label: "Chair", value: CommitteeRole.Chair },
                            ]}
                            value={team.committeeRole ?? CommitteeRole.Member}
                            onChange={(value) =>
                              field.handleChange(
                                field.state.value?.map((val) =>
                                  val.id === team.id
                                    ? { ...val, committeeRole: value }
                                    : val
                                )
                              )
                            }
                            style={{ minWidth: "15ch", marginLeft: "1em" }}
                            title="Committee Role"
                          />
                        ) : (
                          ` (${committeeIdentifier})`
                        ))}
                      <Button
                        onClick={() =>
                          field.removeValue(
                            field.state.value?.findIndex(
                              (val) => val.id === team.id
                            ) ?? 0
                          )
                        }
                        style={{ marginLeft: "1em" }}
                      >
                        Remove
                      </Button>
                    </List.Item>
                  );
                })}
              </List>
              <FormItem label="Add Membership">
                <AutoComplete
                  value={membershipSearch}
                  onChange={(value) => setMembershipSearch(value)}
                  onSelect={(value: string) => {
                    field.pushValue({
                      id: value,
                      committeeRole: null,
                    });
                    setMembershipSearch("");
                  }}
                  style={{ minWidth: "15ch" }}
                >
                  {membershipOptions}
                </AutoComplete>
              </FormItem>
            </>
          )}
        />
        <Form.Item wrapperCol={{ span: 32, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}
