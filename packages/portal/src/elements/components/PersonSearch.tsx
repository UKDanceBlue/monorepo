import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { AutoComplete, type AutoCompleteProps } from "antd";
import { useState } from "react";
import { useQuery } from "urql";

const personSearchDocument = graphql(/* GraphQL */ `
  query PersonSearch($search: String!) {
    searchPeopleByName(name: $search) {
      data {
        id
        name
        linkblue
      }
    }
    personByLinkBlue(linkBlueId: $search) {
      data {
        id
        name
        linkblue
      }
    }
  }
`);

export function PersonSearch({
  onSelect,
  ...props
}: {
  onSelect?: (value: {
    uuid: string;
    name: string | undefined;
    linkblue: string | undefined;
  }) => void;
} & Omit<AutoCompleteProps, "options" | "onSelect" | "onSearch">) {
  const [search, setSearch] = useState("");
  const [{ data, fetching, error }] = useQuery({
    query: personSearchDocument,
    variables: {
      search,
    },
  });

  const { resetWatcher } = useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Searching for people...",
  });

  const options =
    data?.searchPeopleByName.data.map((person) => ({
      value: person.name,
      label: person.name,
      person,
    })) || [];

  if (data?.personByLinkBlue.data) {
    options.push({
      value: data.personByLinkBlue.data.id,
      label: data.personByLinkBlue.data.linkblue
        ? `${data.personByLinkBlue.data.name} (${data.personByLinkBlue.data.linkblue})`
        : data.personByLinkBlue.data.name,
      person: data.personByLinkBlue.data,
    });
  }

  return (
    <AutoComplete
      {...props}
      options={options}
      onSearch={(value) => {
        setSearch(value);
        resetWatcher();
      }}
      onSelect={(value) => {
        const option = options.find((option) => option.value === value);
        if (option) {
          onSelect?.({
            uuid: option.person.id,
            name: option.person.name ?? undefined,
            linkblue: option.person.linkblue ?? undefined,
          });
        }
      }}
    />
  );
}
