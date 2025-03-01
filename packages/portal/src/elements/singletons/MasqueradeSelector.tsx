import { Select } from "antd";
import { useState } from "react";

import { StorageManager, useStorageValue } from "#config/storage.js";
import { graphql } from "#gql/index.js";
import { useQuery } from "#hooks/refine/custom.js";

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
        data?.searchPeopleByName?.map((person) => ({
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
