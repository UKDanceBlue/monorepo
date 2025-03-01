import type { GetRef } from "antd";
import { Spin } from "antd";
import { AutoComplete, type AutoCompleteProps } from "antd";
import { useRef, useState } from "react";

import { graphql } from "#gql/index.js";
import { useQuery } from "#hooks/refine/custom.js";

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
  onSelect?: (
    value: {
      uuid: string;
      name: string | undefined;
      linkblue: string | undefined;
    },
    ref: GetRef<typeof AutoComplete> | null,
    clear: () => void
  ) => void;
} & Omit<AutoCompleteProps, "options" | "onSelect" | "onSearch">) {
  const [search, setSearch] = useState("");
  const [{ data, fetching }] = useQuery({
    query: personSearchDocument,
    variables: {
      search,
    },
    pause: search.length < 3,
  });

  const autocompleteRef = useRef<GetRef<typeof AutoComplete>>(null);

  const options =
    data?.searchPeopleByName?.map((person) => ({
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

  const [selectedName, setSelectedName] = useState<string | undefined>();

  return (
    <AutoComplete
      {...props}
      options={options}
      onSearch={(value) => {
        setSelectedName(undefined);
        setSearch(value);
      }}
      suffixIcon={fetching ? <Spin size="small" /> : undefined}
      ref={autocompleteRef}
      value={selectedName}
      onSelect={(value) => {
        const option = options.find((option) => option.value === value);
        if (option) {
          onSelect?.(
            {
              uuid: option.person.id,
              name: option.person.name ?? undefined,
              linkblue: option.person.linkblue ?? undefined,
            },
            autocompleteRef.current,
            () => setSelectedName(undefined)
          );
          setSelectedName(option.label ?? undefined);
        }
      }}
    />
  );
}
