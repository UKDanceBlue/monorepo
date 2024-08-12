import { PlusOutlined } from "@ant-design/icons";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { TeamType } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
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
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import { useDebouncedCallback } from "use-debounce";

import type { usePointEntryCreatorForm } from "./usePointEntryCreatorForm";
import type { CreatePointOpportunityInput } from "@ukdanceblue/common/graphql-client-portal/raw-types";

const pointEntryOpportunityLookup = graphql(/* GraphQL */ `
  query PointEntryOpportunityLookup($name: String!) {
    pointOpportunities(
      stringFilters: { field: name, comparison: SUBSTRING, value: $name }
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

  const [createStatus, createPointOpportunity] = useMutation(
    createPointOpportunityDocument
  );
  useQueryStatusWatcher({
    fetching: createStatus.fetching,
    loadingMessage: "Creating opportunity",
    error: createStatus.error,
  });

  const [searchByNameQuery, updateSearch] = useQuery({
    query: pointEntryOpportunityLookup,
    pause: true,
    variables: { name: `%${searchOpportunitiesField ?? ""}%` },
  });
  useQueryStatusWatcher({
    fetching: searchByNameQuery.fetching,
    loadingMessage: "Searching opportunities",
    error: searchByNameQuery.error,
  });

  const [nameAutocomplete, setNameAutocomplete] = useState<
    { value: string; label: string }[]
  >([]);
  useEffect(() => {
    if (searchByNameQuery.data?.pointOpportunities.data) {
      const newNameAutocomplete: typeof nameAutocomplete = [];
      for (const opportunity of searchByNameQuery.data.pointOpportunities
        .data) {
        if (opportunity.name) {
          newNameAutocomplete.push({
            value: opportunity.id,
            label: opportunity.name,
          });
        }
      }
      setNameAutocomplete(newNameAutocomplete);
    }
  }, [searchByNameQuery.data?.pointOpportunities.data]);

  const updateAutocomplete = useDebouncedCallback(
    () => {
      console.log("updateAutocomplete", searchOpportunitiesField);
      updateSearch();
    },
    200,
    {
      trailing: true,
    }
  );

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
                createPointOpportunity({
                  input: {
                    name: values.name,
                    opportunityDate: values.opportunityDate ?? null,
                    type: TeamType.Spirit,
                  },
                })
                  .then((result) => {
                    if (result.data?.createPointOpportunity.uuid) {
                      updateAutocomplete();
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
                value={searchOpportunitiesField ?? undefined}
                onBlur={field.handleBlur}
                onChange={(value, option) => {
                  if (Array.isArray(option)) {
                    throw new TypeError("Unexpected array of options");
                  }
                  setSearchOpportunitiesField(option.label);
                  if (!option.value) {
                    field.handleChange(undefined);
                  }
                  if (value) {
                    updateAutocomplete();
                  } else {
                    setNameAutocomplete([]);
                  }
                }}
                onSelect={(value) => {
                  field.handleChange(value);
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
