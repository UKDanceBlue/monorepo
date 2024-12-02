import { LoadingOutlined } from "@ant-design/icons";
import type { AutoCompleteProps } from "antd";
import { AutoComplete } from "antd";
import { useState } from "react";
import { useQuery } from "urql";

import { TeamSelectFragment } from "#documents/team.ts";
import { graphql } from "#graphql/index";
import { readFragment } from "#graphql/index.js";
import { useAntFeedback } from "#hooks/useAntFeedback";

const teamSelectDocument = graphql(
  /* GraphQL */ `
    query TeamSelect($search: String!) {
      teams(
        stringFilters: { comparison: SUBSTRING, value: $search, field: name }
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
