import { ClearOutlined } from "@ant-design/icons";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { AutoComplete, Button, Descriptions, Form } from "antd";
import Search from "antd/es/input/Search";
import { useEffect } from "react";
import { useMutation, useQuery } from "urql";
import { usePointEntryCreatorForm } from "./usePointEntryCreatorForm";

const getPersonByUuidDocument = graphql(/* GraphQL */ `
  query GetPersonByUuid($uuid: String!) {
    person(uuid: $uuid) {
      data {
        uuid
        name
        linkblue
      }
    }
  }
`);

const getPersonByLinkBlueDocument = graphql(/* GraphQL */ `
  query GetPersonByLinkBlue($linkBlue: String!) {
    personByLinkBlue(linkBlueId: $linkBlue) {
      data {
        uuid
        name
        linkblue
      }
    }
  }
`);

const searchPersonByNameDocument = graphql(/* GraphQL */ `
  query SearchPersonByName($name: String!) {
    searchPeopleByName(name: $name) {
      data {
        uuid
        name
        linkblue
      }
    }
  }
`);

const createPersonByLinkBlue = graphql(/* GraphQL */ `
  mutation CreatePersonByLinkBlue($linkBlue: String!, $email: String!) {
    createPerson(input: { email: $email, linkblue: $linkBlue }) {
      data {
        uuid
        linkblue
      }
    }
  }
`);

export function PointEntryPersonLookup({
  formApi,
}: {
  formApi: ReturnType<typeof usePointEntryCreatorForm>["formApi"];
}) {
  // Form state (shared with parent)
  const { getValue, setValue: setPersonFromUuid } = formApi.useField({
    name: "personFromUuid",
  });
  const personFromUuid = getValue();

  const [selectedPersonQuery, updateSelectedPerson] = useQuery({
    query: getPersonByUuidDocument,
    pause: true,
    variables: { uuid: "" },
  });
  useQueryStatusWatcher({
    fetching: selectedPersonQuery.fetching,
    loadingMessage: "Loading selected",
    error: selectedPersonQuery.error,
  });

  useEffect(() => {
    if (personFromUuid) {
      updateSelectedPerson({ uuid: personFromUuid });
    }
  }, [personFromUuid]);

  // Linkblue lookup
  const [getPersonByLinkBlueQuery, getPersonByLinkBlue] = useQuery({
    query: getPersonByLinkBlueDocument,
    pause: true,
    variables: { linkBlue: "" },
  });
  useQueryStatusWatcher({
    fetching: getPersonByLinkBlueQuery.fetching,
    loadingMessage: "Checking linkblue",
    error: getPersonByLinkBlueQuery.error,
  });

  useEffect(() => {
    if (getPersonByLinkBlueQuery.data?.personByLinkBlue.data) {
      setPersonFromUuid(
        getPersonByLinkBlueQuery.data.personByLinkBlue.data.uuid
      );
    }
  }, [getPersonByLinkBlueQuery.data?.personByLinkBlue.data.uuid]);

  // Name lookup
  const [searchByNameQuery, searchByName] = useQuery({
    query: searchPersonByNameDocument,
    pause: true,
    variables: { name: "" },
  });
  useQueryStatusWatcher({
    fetching: searchByNameQuery.fetching,
    loadingMessage: "Searching",
    error: searchByNameQuery.error,
  });

  const [createPersonQuery, createPerson] = useMutation(createPersonByLinkBlue);
  useQueryStatusWatcher({
    fetching: createPersonQuery.fetching,
    loadingMessage: "Creating",
    error: createPersonQuery.error,
  });

  useEffect(() => {
    if (selectedPersonQuery.data?.person.data) {
      setPersonFromUuid(selectedPersonQuery.data.person.data.uuid);
    }
  }, [selectedPersonQuery.data?.person.data]);

  return (
    <formApi.Field
      name="personFromUuid"
      children={(field) => (
        <>
          <Form.Item
            label="Person"
            validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
            help={
              field.state.meta.errors.length > 0
                ? field.state.meta.errors[0]
                : undefined
            }
          >
            {/* Three options to choose a person, autocomplete name, autocomplete linkblue, or manual entry */}
            <AutoComplete
              value={field.state.value ?? undefined}
              onBlur={field.handleBlur}
              disabled={!!field.state.value}
              onChange={(value) => {
                field.handleChange(value);
                updateSelectedPerson({ uuid: value });
              }}
              onSearch={(value) => {
                searchByName({ name: value });
              }}
              onSelect={(value) => {
                field.handleChange(value);
                updateSelectedPerson({ uuid: value });
              }}
              options={
                searchByNameQuery.data?.searchPeopleByName.data.map(
                  (person) => ({
                    label: person.name,
                    value: person.uuid,
                  })
                ) ?? []
              }
            />
            <Search
              name={`${field.name}-linkblue-lookup`}
              onBlur={field.handleBlur}
              disabled={!!field.state.value}
              onSearch={(value) => {
                getPersonByLinkBlue({ linkBlue: value });
              }}
              placeholder="LinkBlue"
              enterButton="Lookup"
              loading={getPersonByLinkBlueQuery.fetching}
            />
            <Search
              name={`${field.name}-linkblue-create`}
              onBlur={field.handleBlur}
              disabled={!!field.state.value}
              onSearch={(value) => {
                createPerson({
                  linkBlue: value,
                  email: `${value}@uky.edu`,
                }).then((result) => {
                  if (result.data?.createPerson.data) {
                    setPersonFromUuid(result.data.createPerson.data.uuid);
                  }
                });
              }}
              placeholder="LinkBlue"
              enterButton="Create"
              color="green"
              loading={createPersonQuery.fetching}
            />
            <Button
              color="grey"
              onClick={() => {
                field.handleChange("");
                setPersonFromUuid("");
              }}
              icon={<ClearOutlined />}
            >
              Clear
            </Button>
            <Descriptions>
              <Descriptions.Item label="Name">
                {selectedPersonQuery.data?.person?.data?.name ??
                  "Never Logged In"}
              </Descriptions.Item>
              <Descriptions.Item label="LinkBlue">
                {selectedPersonQuery.data?.person?.data?.linkblue}
              </Descriptions.Item>
            </Descriptions>
          </Form.Item>
        </>
      )}
    />
  );
}
