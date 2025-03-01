import type { SelectProps } from "antd";
import { Select } from "antd";

import { TeamSelectFragment } from "#documents/team.js";
import { useTypedSelect } from "#hooks/refine/select.tsx";

export function TeamSelect({
  defaultValue,
  marathonYear,
  ...props
}: {
  marathonYear?: string;
} & Omit<SelectProps, "options">) {
  const { selectProps } = useTypedSelect({
    fragment: TeamSelectFragment,
    props: {
      resource: "team",
      filters: marathonYear
        ? [{ field: "marathonYear", value: marathonYear, operator: "eq" }]
        : [],
      defaultValue,
      searchField: "$search",
      optionLabel: "name",
      optionValue: "id",
      queryOptions: {
        select(data) {
          return {
            total: data.total,
            data: data.data.map((team) => ({
              $search: team.name,
              id: team.id,
              name: `${team.name} (${team.marathon.year})`,
            })),
          };
        },
      },
    },
  });

  return (
    <Select
      {...selectProps}
      placeholder="Search for a team"
      {...props}
      style={{ minWidth: 300, ...props.style }}

      // suffixIcon={result.fetching && <LoadingOutlined spin />}
      // onSearch={setSearch}
      // onSelect={(value) => {
      //   const team = fragmentData.find((team) => team.id === value);
      //   if (team) {
      //     setSearch(team.name);
      //     Promise.resolve(onSelect(team))
      //       .then(() => setSearch(""))
      //       .catch((error: unknown) => {
      //         console.error(error);
      //         showErrorMessage(String(error));
      //       });
      //   }
      // }}
    />
  );
}
