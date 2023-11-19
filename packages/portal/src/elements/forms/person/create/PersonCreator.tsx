import { useNavigate } from "@tanstack/react-router";
import { CommitteeRole, committeeNames } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import { Button, Empty, Flex, Form, Input, Select } from "antd";

import type { TeamNameFragment } from "../PersonFormsGQL";

import { usePersonCreatorForm } from "./usePersonCreatorForm";

export function PersonCreator({
  teamNamesFragment,
}: {
  teamNamesFragment?:
    | readonly FragmentType<typeof TeamNameFragment>[]
    | undefined;
}) {
  const navigate = useNavigate();

  const { formApi, captaincyOptions, membershipOptions } = usePersonCreatorForm(
    teamNamesFragment,
    (ret) => {
      if (ret?.uuid) {
        navigate({
          to: "/people/$personId/",
          params: { personId: ret.uuid },
        }).catch(console.error);
      }
    }
  );

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
            formApi.handleSubmit().catch(console.error);
          }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 32 }}
        >
          <formApi.Field
            name="name"
            children={(field) => (
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
          />
          <formApi.Field
            name="linkblue"
            children={(field) => (
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
          />
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
                  value={field.state.value ?? null}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                  options={[
                    {
                      label: "None",
                      value: null,
                    },
                    ...Object.entries(committeeNames).map(([value, label]) => ({
                      label,
                      value,
                    })),
                  ]}
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
