import type { Authorization } from "@ukdanceblue/common";
import { AccessLevel, CommitteeRole } from "@ukdanceblue/common";
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

import { useMarathon } from "#config/marathonContext.js";
import { TeamNameFragment } from "#documents/person.js";
import { PersonEditorFragment } from "#documents/person.js";
import { TanAntFormItem } from "#elements/components/form/TanAntFormItem.js";
import type { FragmentOf } from "#graphql/index.js";
import { readFragment } from "#graphql/index.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";

import { usePersonEditorForm } from "./usePersonEditorForm.js";

export function PersonEditor({
  personFragment,
  teamNamesFragment,
  refetchPerson,
}: {
  personFragment?: FragmentOf<typeof PersonEditorFragment> | undefined | null;
  teamNamesFragment?:
    | readonly FragmentOf<typeof TeamNameFragment>[]
    | undefined;
  refetchPerson?: UseQueryExecute | undefined;
  authorization?: Authorization | undefined;
}) {
  const selectedMarathon = useMarathon();

  const isAdmin = useAuthorizationRequirement(AccessLevel.Admin);

  const { message } = App.useApp();

  const { formApi } = usePersonEditorForm(personFragment, () => {
    if (refetchPerson) {
      refetchPerson({ requestPolicy: "network-only" });
    }
  });

  const teamNamesData = (
    teamNamesFragment ? readFragment(TeamNameFragment, teamNamesFragment) : []
  ).toSorted(({ marathon: { year } }) =>
    year === selectedMarathon?.year ? 0 : 1
  );

  const personData = readFragment(PersonEditorFragment, personFragment);

  const [captainSearch, setCaptainSearch] = useState("");
  const lowerCaptainSearch = captainSearch.toLowerCase();
  const captainOptions: ReactNode[] = [];
  for (const team of teamNamesData) {
    if (!team.name.toLowerCase().includes(lowerCaptainSearch)) continue;
    captainOptions.push(
      <AutoComplete.Option key={team.id} value={team.id}>
        {team.marathon.year === selectedMarathon?.year ? (
          <b>{team.marathon.year} </b>
        ) : (
          `${team.marathon.year} `
        )}
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
        {team.marathon.year === selectedMarathon?.year ? (
          <b>{team.marathon.year} </b>
        ) : (
          `${team.marathon.year} `
        )}
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
                  const { name, committeeIdentifier, marathon } =
                    personData.teams.find(
                      (option) => option.team.id === team.id
                    )?.team ??
                    teamNamesData.find((option) => option.id === team.id) ??
                    {};
                  return (
                    <List.Item key={team.id}>
                      {marathon?.year ? `${marathon.year} ` : ""}
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
                          ` (${team.committeeRole})`
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
                  const { name, committeeIdentifier, marathon } =
                    personData.teams.find(
                      (option) => option.team.id === team.id
                    )?.team ??
                    teamNamesData.find((option) => option.id === team.id) ??
                    {};
                  return (
                    <List.Item key={team.id}>
                      {marathon?.year ? `${marathon.year} ` : ""}
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
                          ` (${team.committeeRole})`
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
        <formApi.Subscribe selector={({ errors }) => errors}>
          {(errors) => (
            <>
              <Typography.Text type="danger">
                {errors.join(", ")}
              </Typography.Text>
              <Form.Item wrapperCol={{ span: 32, offset: 8 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={errors.length > 0}
                >
                  Save
                </Button>
              </Form.Item>
            </>
          )}
        </formApi.Subscribe>
      </Form>
    </Flex>
  );
}
