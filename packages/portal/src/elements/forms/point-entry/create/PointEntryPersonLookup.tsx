import { ClearOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useAskConfirm, useUnknownErrorHandler } from "@hooks/useAntFeedback";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { AutoComplete, Button, Descriptions, Flex, Form, Input } from "antd";
import type { LegacyRef } from "react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import { useDebouncedCallback } from "use-debounce";

import {
  createPersonByLinkBlue,
  getPersonByLinkBlueDocument,
  getPersonByUuidDocument,
  searchPersonByNameDocument,
} from "./PointEntryCreatorGQL";
import type { usePointEntryCreatorForm } from "./usePointEntryCreatorForm";

const generalLinkblueRegex = new RegExp(/^[A-Za-z]{3,4}\d{3}$/);
export function PointEntryPersonLookup({
  formApi,
  nameFieldRef,
  linkblueFieldRef,
  selectedPersonRef,
  clearButtonRef,
}: {
  formApi: ReturnType<typeof usePointEntryCreatorForm>["formApi"];
  nameFieldRef: LegacyRef<HTMLDivElement>;
  linkblueFieldRef: Parameters<typeof Input>[0]["ref"];
  selectedPersonRef: LegacyRef<HTMLSpanElement>;
  clearButtonRef: Parameters<typeof Button>[0]["ref"];
}) {
  const { showErrorMessage } = useUnknownErrorHandler();
  // Form state (shared with parent)
  const { state, setValue: setPersonFromUuid } = formApi.useField({
    name: "personFromUuid",
  });
  const personFromUuid = state.value;

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
  }, [personFromUuid, updateSelectedPerson]);

  // Linkblue lookup
  const [linkblueFieldValue, setLinkblueFieldValue] = useState<
    string | undefined
  >(undefined);

  const [getPersonByLinkBlueQuery, getPersonByLinkBlue] = useQuery({
    query: getPersonByLinkBlueDocument,
    pause: true,
    requestPolicy: "network-only",
    variables: { linkBlue: linkblueFieldValue ?? "" },
  });
  useQueryStatusWatcher({
    fetching: getPersonByLinkBlueQuery.fetching,
    loadingMessage: "Checking linkblue",
    error: getPersonByLinkBlueQuery.error,
  });

  useEffect(() => {
    if (getPersonByLinkBlueQuery.data?.personByLinkBlue) {
      setPersonFromUuid(getPersonByLinkBlueQuery.data.personByLinkBlue.id);
    }
  }, [
    getPersonByLinkBlueQuery.data?.personByLinkBlue,
    getPersonByLinkBlueQuery.data?.personByLinkBlue?.id,
    setPersonFromUuid,
  ]);

  // When someone searches for a linkblue and it does not exist, we want to
  // set linkblueKnownDoesNotExist to the linkblue that was searched for.
  // When the linkblue field changes, we want to clear that message.
  const [searchedForLinkblue, setSearchedForLinkblue] = useState<
    string | undefined
  >(undefined);
  const [linkblueKnownDoesNotExist, setLinkblueKnownDoesNotExist] = useState<
    string | undefined
  >(undefined);
  useEffect(() => {
    if (linkblueFieldValue) {
      if (
        linkblueFieldValue === searchedForLinkblue &&
        !getPersonByLinkBlueQuery.data?.personByLinkBlue
      ) {
        setLinkblueKnownDoesNotExist(linkblueFieldValue);
      } else {
        setLinkblueKnownDoesNotExist(undefined);
      }
    }
  }, [
    getPersonByLinkBlueQuery.data?.personByLinkBlue,
    linkblueFieldValue,
    searchedForLinkblue,
  ]);

  // Name lookup
  const [searchByNameField, setSearchByNameField] = useState<
    string | undefined
  >(undefined);
  const [searchByNameQuery, searchByName] = useQuery({
    query: searchPersonByNameDocument,
    pause: true,
    requestPolicy: "network-only",
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
    if (searchByNameQuery.data?.searchPeopleByName) {
      const newNameAutocomplete: typeof nameAutocomplete = [];
      for (const person of searchByNameQuery.data.searchPeopleByName) {
        if (person.name) {
          newNameAutocomplete.push({
            value: person.id,
            label: person.name,
          });
        }
      }
      setNameAutocomplete(newNameAutocomplete);
    }
  }, [searchByNameQuery.data?.searchPeopleByName]);

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

  const { openConfirmModal } = useAskConfirm({
    modalTitle: "Are you sure this is a valid LinkBlue?",
    modalContent: (
      <>
        A LinkBlue ID is usually 3-4 letters followed by 3 numbers, for example:{" "}
        <i>abcd123</i>. There are some exceptions, but most will follow that
        format.
      </>
    ),
    okText: "Yes",
    cancelText: "No",
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
                <div ref={nameFieldRef} style={{ width: "100%" }}>
                  {/* Three options to choose a person, autocomplete name, autocomplete linkblue, or manual entry */}
                  <AutoComplete
                    placeholder="Search by Name"
                    value={
                      (personFromUuid &&
                        selectedPersonQuery.data?.person.name) ??
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
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="LinkBlue">
                <Input
                  name={`${field.name}-linkblue-field`}
                  value={
                    (personFromUuid &&
                      selectedPersonQuery.data?.person.linkblue) ??
                    linkblueFieldValue
                  }
                  onChange={(e) => {
                    setLinkblueFieldValue(e.target.value);
                  }}
                  disabled={!!field.state.value}
                  onBlur={field.handleBlur}
                  placeholder="Lookup Existing LinkBlue"
                  ref={linkblueFieldRef}
                />
                {!linkblueKnownDoesNotExist ? (
                  <Button
                    name={`${field.name}-linkblue-lookup`}
                    onBlur={field.handleBlur}
                    disabled={!!field.state.value || !linkblueFieldValue}
                    onClick={() => {
                      if (linkblueFieldValue) {
                        setSearchedForLinkblue(linkblueFieldValue);
                        getPersonByLinkBlue();
                      }
                    }}
                    loading={getPersonByLinkBlueQuery.fetching}
                    icon={<SearchOutlined />}
                  >
                    Lookup
                  </Button>
                ) : (
                  <Button
                    name={`${field.name}-linkblue-create`}
                    onBlur={field.handleBlur}
                    disabled={!!field.state.value || !linkblueFieldValue}
                    onClick={async () => {
                      if (linkblueFieldValue) {
                        try {
                          if (!generalLinkblueRegex.test(linkblueFieldValue)) {
                            try {
                              await openConfirmModal();
                            } catch (error) {
                              if (error === "cancel") {
                                return;
                              } else {
                                throw error;
                              }
                            }
                          }
                          const result = await createPerson({
                            linkBlue: linkblueFieldValue,
                            email: `${linkblueFieldValue}@uky.edu`,
                          });
                          if (result.data?.createPerson.id) {
                            setPersonFromUuid(result.data.createPerson.id);
                          }
                        } catch (error) {
                          showErrorMessage(error);
                        }
                      }
                    }}
                    loading={createPersonQuery.fetching}
                    icon={<PlusOutlined />}
                    color="default"
                  >
                    Create
                  </Button>
                )}
              </Descriptions.Item>
            </Descriptions>
            <Flex justify="space-between" wrap="wrap">
              <span ref={selectedPersonRef}>
                {field.state.value ? (
                  <>
                    <span>Selected Person:</span>{" "}
                    {selectedPersonQuery.data?.person ? (
                      <i>
                        {selectedPersonQuery.data.person.name ??
                          selectedPersonQuery.data.person.linkblue}
                      </i>
                    ) : (
                      "No name or linkblue found"
                    )}
                  </>
                ) : (
                  "Nobody selected"
                )}
              </span>
              <Button
                color="default"
                onClick={() => {
                  field.handleChange("");
                  setPersonFromUuid("");
                }}
                icon={<ClearOutlined />}
                disabled={!field.state.value}
                ref={clearButtonRef}
              >
                Clear
              </Button>
            </Flex>
          </Form.Item>
        </>
      )}
    />
  );
}
