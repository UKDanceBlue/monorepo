import { dateTimeFromSomething } from "@ukdanceblue/common";
import { useMemo } from "react";

import { graphql, readFragment } from "#gql/index.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";
import { useQuery, useTypedOne } from "#hooks/useTypedRefine.js";

import type { MarathonContextData } from "./marathonContext.js";
import { marathonContext } from "./marathonContext.js";
import { StorageManager, useStorageValue } from "./storage.js";

const MarathonFragment = graphql(/* GraphQL */ `
  fragment MarathonSelection on MarathonNode {
    id
    year
    startDate
    endDate
  }
`);

const latestMarathonDocument = graphql(
  /* GraphQL */ `
    query ActiveMarathon {
      latestMarathon {
        ...MarathonSelection
      }
    }
  `,
  [MarathonFragment]
);

const allMarathonsDocument = graphql(
  /* GraphQL */ `
    query AllMarathons {
      marathons(sendAll: true) {
        data {
          ...MarathonSelection
        }
      }
    }
  `,
  [MarathonFragment]
);

export const MarathonConfigProvider = ({
  children,
  valueOverride,
}: {
  children: React.ReactNode;
  valueOverride?: Pick<MarathonContextData, "marathon" | "marathons">;
}) => {
  const canSeeMarathonList = useAuthorizationRequirement(
    "list",
    "MarathonNode"
  );

  const [marathonId, setMarathonId] = useStorageValue(
    StorageManager.Session,
    StorageManager.keys.selectedMarathon
  );

  const [latestMarathonResult] = useQuery({
    query: latestMarathonDocument,
    pause: valueOverride != null,
  });
  const [allMarathonsResult] = useQuery({
    query: allMarathonsDocument,
    pause: !canSeeMarathonList || valueOverride != null,
  });

  const selectedMarathonResult = useTypedOne({
    fragment: MarathonFragment,
    props: {
      id: marathonId ?? "",
      resource: "marathon",
      queryOptions: {
        enabled: Boolean(marathonId),
      },
    },
  });

  const marathon = readFragment(
    MarathonFragment,
    marathonId != null && selectedMarathonResult.data != null
      ? selectedMarathonResult.data.data
      : latestMarathonResult.data != null
        ? latestMarathonResult.data.latestMarathon
        : null
  );

  const startDate = useMemo(() => {
    return dateTimeFromSomething(marathon?.startDate) ?? null;
  }, [marathon?.startDate]);
  const endDate = useMemo(() => {
    return dateTimeFromSomething(marathon?.endDate) ?? null;
  }, [marathon?.endDate]);

  if (valueOverride) {
    return (
      <marathonContext.Provider
        value={{
          marathon: valueOverride.marathon,
          marathons: valueOverride.marathons,
          loading: false,
          setMarathon: () => undefined,
        }}
      >
        {children}
      </marathonContext.Provider>
    );
  }

  return (
    <marathonContext.Provider
      value={{
        setMarathon: setMarathonId,
        marathon: marathon
          ? {
              id: marathon.id,
              year: marathon.year,
              startDate,
              endDate,
            }
          : null,
        marathons: readFragment(
          MarathonFragment,
          allMarathonsResult.data?.marathons.data ??
            (latestMarathonResult.data?.latestMarathon
              ? [latestMarathonResult.data.latestMarathon]
              : [])
        ),
        loading:
          latestMarathonResult.fetching || selectedMarathonResult.isLoading,
      }}
    >
      {children}
    </marathonContext.Provider>
  );
};
