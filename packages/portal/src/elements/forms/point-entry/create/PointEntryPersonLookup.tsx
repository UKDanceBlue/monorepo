import { ClearOutlined, PlusOutlined } from "@ant-design/icons";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { AutoComplete, Button, Descriptions, Form } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import { useDebouncedCallback } from "use-debounce";
import {
  createPersonByLinkBlue,
  getPersonByLinkBlueDocument,
  getPersonByUuidDocument,
  searchPersonByNameDocument,
} from "./PointEntryCreatorGQL";
import { usePointEntryCreatorForm } from "./usePointEntryCreatorForm";

export function PointEntryPersonLookup({
  formApi,
  teamUuid,
}: {
  formApi: ReturnType<typeof usePointEntryCreatorForm>["formApi"];
  teamUuid: string;
}) {
  // Form state (shared with parent)
  const { getValue, setValue: setPersonFromUuid } = formApi.useField({
    name: "personFromUuid",
  });
  const personFromUuid = getValue();

  const [selectedPersonQuery, updateSelectedPerson] = useQuery({
    query: getPersonByUuidDocument,
    pause: true,
    variables: { uuid: personFromUuid ?? "" },
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
  const [linkblueFieldValue, setLinkblueFieldValue] = useState<
    string | undefined
  >(undefined);

  const [getPersonByLinkBlueQuery, getPersonByLinkBlue] = useQuery({
    query: getPersonByLinkBlueDocument,
    pause: true,
    variables: { linkBlue: linkblueFieldValue ?? "" },
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
  const [searchByNameField, setSearchByNameField] = useState<
    string | undefined
  >(undefined);
  const [searchByNameQuery, searchByName] = useQuery({
    query: searchPersonByNameDocument,
    pause: true,
    variables: { name: searchByNameField ?? "" },
  });
  useQueryStatusWatcher({
    fetching: searchByNameQuery.fetching,
    loadingMessage: "Searching",
    error: searchByNameQuery.error,
  });

  const [nameAutocomplete, setNameAutocomplete] = useState<
    { value: string; label: string }[]
  >([]);
  useEffect(() => {
    if (searchByNameQuery.data?.searchPeopleByName.data) {
      const newNameAutocomplete: typeof nameAutocomplete = [];
      for (const person of searchByNameQuery.data.searchPeopleByName.data) {
        if (person.name) {
          newNameAutocomplete.push({
            value: person.uuid,
            label: person.name,
          });
        }
      }
      setNameAutocomplete(newNameAutocomplete);
    }
  }, [searchByNameQuery.data?.searchPeopleByName.data]);

  const updateAutocomplete = useDebouncedCallback(
    (name: string) => {
      searchByName({ name });
    },
    200,
    {
      trailing: true,
    }
  );

  const [createPersonQuery, createPerson] = useMutation(createPersonByLinkBlue);
  useQueryStatusWatcher({
    fetching: createPersonQuery.fetching,
    loadingMessage: "Creating",
    error: createPersonQuery.error,
  });

  return (
    <formApi.Field
      name="personFromUuid"
      children={(field) => (
        <>
          <Form.Item
            label="Person (enter name or linkblue)"
            validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
            help={
              field.state.meta.errors.length > 0
                ? field.state.meta.errors[0]
                : undefined
            }
          >
            <Descriptions column={1}>
              <Descriptions.Item label="Name">
                {/* Three options to choose a person, autocomplete name, autocomplete linkblue, or manual entry */}
                <AutoComplete
                  placeholder="Search by Name"
                  value={
                    (personFromUuid &&
                      selectedPersonQuery.data?.person?.data?.name) ||
                    searchByNameField
                  }
                  onBlur={field.handleBlur}
                  disabled={!!field.state.value}
                  onChange={(value) => {
                    setSearchByNameField(value);
                    if (value) {
                      updateAutocomplete(value);
                    } else {
                      setNameAutocomplete([]);
                    }
                  }}
                  onSelect={(value) => {
                    field.handleChange(value);
                    updateSelectedPerson();
                  }}
                  options={nameAutocomplete}
                />
              </Descriptions.Item>
              <Descriptions.Item label="LinkBlue">
                <Search
                  name={`${field.name}-linkblue-lookup`}
                  value={
                    (personFromUuid &&
                      selectedPersonQuery.data?.person?.data?.linkblue) ||
                    linkblueFieldValue
                  }
                  onChange={(e) => {
                    setLinkblueFieldValue(e.target.value);
                  }}
                  onBlur={field.handleBlur}
                  disabled={!!field.state.value}
                  onSearch={() => {
                    getPersonByLinkBlue();
                  }}
                  placeholder="Lookup Existing LinkBlue"
                  enterButton="Lookup"
                  loading={getPersonByLinkBlueQuery.fetching}
                />
                <Button
                  name={`${field.name}-linkblue-create`}
                  onBlur={field.handleBlur}
                  disabled={!!field.state.value || !linkblueFieldValue}
                  onClick={() => {
                    if (linkblueFieldValue) {
                      createPerson({
                        linkBlue: linkblueFieldValue,
                        email: `${linkblueFieldValue}@uky.edu`,
                        teamUuid,
                      }).then((result) => {
                        if (result.data?.createPerson.uuid) {
                          setPersonFromUuid(result.data.createPerson.uuid);
                        }
                      });
                    }
                  }}
                  loading={createPersonQuery.fetching}
                  icon={<PlusOutlined />}
                  color="green"
                >
                  Create
                </Button>
              </Descriptions.Item>
            </Descriptions>
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
          </Form.Item>
        </>
      )}
    />
  );
}
