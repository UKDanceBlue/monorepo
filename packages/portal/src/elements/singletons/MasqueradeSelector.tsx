import { Select } from "antd";
import { useMemo, useRef, useState } from "react";
import { useQuery } from "urql";

import { StorageManager, useStorageValue } from "#config/storage.ts";
import { graphql } from "#gql/index.js";

export function MasqueradeSelector() {
  const [search, setSearch] = useState("");
  const [, setMasquerade] = useStorageValue(
    StorageManager.Local,
    StorageManager.keys.masquerade
  );

  const [{ data, fetching, error }] = useQuery({
    query: graphql(/* GraphQL */ `
      query MasqueradeSelector($search: String!) {
        searchPeopleByName(name: $search) {
          id
          name
        }
      }
    `),
    variables: { search },
    pause: search.length < 3,
  });

  const lastOptions = useRef<{ label: string; value: string }[]>([]);
  const options = useMemo((): { label: string; value: string }[] => {
    if (fetching) {
      return lastOptions.current;
    } else if (data) {
      return data.searchPeopleByName.map((person) => ({
        value: person.id,
        label: person.name ?? "[ERROR]",
      }));
    } else {
      return [];
    }
  }, [data, fetching]);
  lastOptions.current = options;

  if (error) {
    console.error(error);
  }

  return (
    <Select
      variant="outlined"
      style={{
        width: "100%",
        display: "inline-block",
      }}
      notFoundContent={
        search.length < 3
          ? "Type at least 3 characters"
          : fetching
            ? null
            : undefined
      }
      options={
        data?.searchPeopleByName.map((person) => ({
          value: person.id,
          label: person.name,
        })) ?? []
      }
      onSelect={(value) => {
        setMasquerade(String(value));
        window.location.reload();
      }}
      onSearch={setSearch}
      showSearch
      placeholder="Masquerade as..."
      loading={fetching}
      suffixIcon={null}
      filterOption={false}
    />
  );
}
