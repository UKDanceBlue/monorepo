import { type CombinedError, useQuery } from "urql";

import { graphql } from "..";

export function useActiveMarathon():
  | [undefined, undefined, true]
  | [
      {
        id: string;
        year: string;
        startDate: string | null;
        endDate: string | null;
      } | null,
      undefined,
      false,
    ]
  | [undefined, CombinedError | Error, false] {
  const [query] = useQuery({
    query: graphql(/* GraphQL */ `
      query ActiveMarathon {
        latestMarathon {
          id
          year
          startDate
          endDate
        }
      }
    `),
    requestPolicy: "cache-first",
  });

  if (query.fetching) {
    return [undefined, undefined, true];
  }
  if (query.error) {
    return [undefined, query.error, false];
  }
  return [query.data?.latestMarathon ?? null, undefined, false];
}
