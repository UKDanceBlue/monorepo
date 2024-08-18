import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { AutoComplete, type AutoCompleteProps } from "antd";
import { useState } from "react";
import { useQuery } from "urql";

const personSearchDocument = graphql(/* GraphQL */ `
  query PersonSearch($search: String!) {
    searchPeopleByName(name: $search) {
      id
      name
      linkblue
    }
    personByLinkBlue(linkBlueId: $search) {
      id
      name
      linkblue
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
    data?.searchPeopleByName.map((person) => ({
      value: person.name,
      label: person.name,
      person,
    })) ?? [];

  if (data?.personByLinkBlue) {
    options.push({
      value: data.personByLinkBlue.id,
      label: data.personByLinkBlue.linkblue
        ? `${data.personByLinkBlue.name} (${data.personByLinkBlue.linkblue})`
        : data.personByLinkBlue.name,
      person: data.personByLinkBlue,
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
