import { PlusOutlined } from "@ant-design/icons";
import { useMarathon } from "@config/marathonContext";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { TeamType } from "@ukdanceblue/common";
import { graphql } from "@graphql";
import type { CreatePointOpportunityInput } from "@graphql/raw-types";
import {
  App,
  AutoComplete,
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
} from "antd";
import { useState } from "react";
import { useMutation, useQuery } from "urql";

import type { usePointEntryCreatorForm } from "./usePointEntryCreatorForm";

const pointEntryOpportunityLookup = graphql(/* GraphQL */ `
  query PointEntryOpportunityLookup($name: String!, $marathonUuid: String!) {
    pointOpportunities(
      stringFilters: { field: name, comparison: SUBSTRING, value: $name }
      oneOfFilters: { field: marathonUuid, value: [$marathonUuid] }
      sendAll: true
    ) {
      data {
        name
        id
      }
    }
  }
`);

const createPointOpportunityDocument = graphql(/* GraphQL */ `
  mutation CreatePointOpportunity($input: CreatePointOpportunityInput!) {
    createPointOpportunity(input: $input) {
      uuid
    }
  }
`);

export function PointEntryOpportunityLookup({
  formApi,
}: {
  formApi: ReturnType<typeof usePointEntryCreatorForm>["formApi"];
}) {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [searchOpportunitiesField, setSearchOpportunitiesField] = useState<
    string | undefined
  >(undefined);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const [createStatus, createPointOpportunity] = useMutation(
    createPointOpportunityDocument
  );
  const marathon = useMarathon();
  useQueryStatusWatcher({
    fetching: createStatus.fetching,
    loadingMessage: "Creating opportunity",
    error: createStatus.error,
  });

  const [searchByNameQuery] = useQuery({
    query: pointEntryOpportunityLookup,
    pause: !marathon || !searchOpportunitiesField,
    variables: {
      name: searchOpportunitiesField ?? "",
      marathonUuid: marathon?.id ?? "",
    },
  });
  useQueryStatusWatcher({
    fetching: searchByNameQuery.fetching,
    loadingMessage: "Searching opportunities",
    error: searchByNameQuery.error,
  });

  const nameAutocomplete: { value: string; label: string }[] = [];
  if (searchByNameQuery.data?.pointOpportunities.data) {
    for (const opportunity of searchByNameQuery.data.pointOpportunities.data) {
      if (opportunity.name) {
        nameAutocomplete.push({
          value: opportunity.id,
          label: opportunity.name,
        });
      }
    }
  }

  const { message } = App.useApp();

  return (
    <formApi.Field name="opportunityUuid">
      {(field) => (
        <Flex>
          <Modal
            title="Create New Opportunity"
            open={createModalVisible}
            onCancel={() => setCreateModalVisible(false)}
            footer={null}
          >
            <Form
              layout="vertical"
              onFinish={(values: CreatePointOpportunityInput) => {
                if (!marathon) {
                  message.error("Marathon must be selected before creating");
                  return;
                }
                createPointOpportunity({
                  input: {
                    name: values.name,
                    opportunityDate: values.opportunityDate ?? null,
                    type: TeamType.Spirit,
                    marathonUuid: marathon.id,
                  },
                })
                  .then((result) => {
                    if (result.data?.createPointOpportunity.uuid) {
                      field.handleChange(
                        result.data.createPointOpportunity.uuid
                      );
                      setCreateModalVisible(false);
                    }
                  })
                  .catch((error: unknown) => {
                    if (error instanceof Error) {
                      void message.error(error.message);
                    } else {
                      void message.error("An unknown error occurred");
                    }
                  });
              }}
            >
              <Form.Item
                label="Opportunity Name"
                name="name"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Date"
                name="opportunityDate"
                rules={[{ required: true, message: "Description is required" }]}
              >
                <DatePicker showTime />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Form.Item
            label="Opportunity"
            validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
            help={
              field.state.meta.errors.length > 0
                ? field.state.meta.errors[0]
                : undefined
            }
          >
            <Flex>
              <AutoComplete
                placeholder="Opportunity Name"
                value={selected ?? searchOpportunitiesField ?? undefined}
                onBlur={field.handleBlur}
                onChange={(value, option) => {
                  if (Array.isArray(option)) {
                    throw new TypeError("Unexpected array of options");
                  }
                  setSelected(undefined);
                  setSearchOpportunitiesField(value);
                  if (!option.value) {
                    field.handleChange(undefined);
                  }
                }}
                onSelect={(value, { label }) => {
                  field.handleChange(value);
                  setSelected(label);
                }}
                options={nameAutocomplete}
                style={{ minWidth: "30ch" }}
              />
              <Button
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
                title="Create New Opportunity"
              ></Button>
            </Flex>
          </Form.Item>
        </Flex>
      )}
    </formApi.Field>
  );
}
