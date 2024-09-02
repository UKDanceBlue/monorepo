import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { AutoComplete } from "antd";
import { useState } from "react";
import { useQuery } from "urql";

export function MasqueradeSelector() {
  const [{ data, fetching, error }] = useQuery({
    query: graphql(/* GraphQL */ `
      query MasqueradeSelector {
        listPeople {
          data {
            id
            name
          }
        }
      }
    `),
  });

  const [search, setSearch] = useState("");

  if (error) {
    console.error(error);
  }

  return (
    <AutoComplete
      variant="borderless"
      style={{ width: "30ch", display: "inline-block" }}
      options={
        data?.listPeople.data
          .filter((person) =>
            person.name?.toLowerCase().includes(search.toLowerCase())
          )
          .map((person) => ({
            value: person.id,
            label: person.name,
          })) ?? []
      }
      onSelect={(value) => {
        window.location.search = `?masquerade=${value}`;
      }}
      onSearch={setSearch}
      placeholder="Masquerade as..."
      disabled={fetching}
    />
  );
}
