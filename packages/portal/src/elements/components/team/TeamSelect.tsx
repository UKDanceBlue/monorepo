import { LoadingOutlined } from "@ant-design/icons";
import type { AutoCompleteProps } from "antd";
import { AutoComplete } from "antd";
import { useState } from "react";

import { TeamSelectFragment } from "#documents/team.js";
import { graphql } from "#gql/index.js";
import { readFragment } from "#gql/index.js";
import { useAntFeedback } from "#hooks/useAntFeedback";
import { useQuery } from "#hooks/useTypedRefine.js";

const teamSelectDocument = graphql(
  /* GraphQL */ `
    query TeamSelect($search: String!) {
      teams(
        filters: {
          operator: AND
          filters: [
            {
              field: name
              filter: {
                singleStringFilter: {
                  comparison: INSENSITIVE_CONTAINS
                  value: $search
                }
              }
            }
          ]
        }
        sendAll: true
      ) {
        data {
          ...TeamSelect
        }
      }
    }
  `,
  [TeamSelectFragment]
);

export function TeamSelect({
  onSelect,
  ...props
}: {
  onSelect: (team: { id: string }) => Promise<void> | void;
} & Omit<
  AutoCompleteProps<string>,
  "options" | "onSelect" | "onSearch" | "suffixIcon"
>) {
  const [search, setSearch] = useState("");
  const [result] = useQuery({
    query: teamSelectDocument,
    variables: { search },
    pause: search.length < 3,
  });

  const fragmentData = readFragment(
    TeamSelectFragment,
    result.data?.teams.data ?? []
  );

  const { showErrorMessage } = useAntFeedback();

  return (
    <AutoComplete
      placeholder="Search for a team"
      {...props}
      style={{ minWidth: 300, ...props.style }}
      options={fragmentData.map((team) => ({
        label: team.name,
        value: team.id,
      }))}
      value={search}
      suffixIcon={result.fetching && <LoadingOutlined spin />}
      onSearch={setSearch}
      onSelect={(value) => {
        const team = fragmentData.find((team) => team.id === value);
        if (team) {
          setSearch(team.name);
          Promise.resolve(onSelect(team))
            .then(() => setSearch(""))
            .catch((error: unknown) => {
              console.error(error);
              showErrorMessage(String(error));
            });
        }
      }}
    />
  );
}
