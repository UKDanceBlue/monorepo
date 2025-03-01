import { keys } from "@refinedev/core";
import { dateTimeFromSomething } from "@ukdanceblue/common";
import { useMemo } from "react";

import { graphql, readFragment } from "#gql/index.js";
import { useTypedCustomQuery } from "#hooks/refine/custom.js";
import { useTypedOne } from "#hooks/refine/one.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";

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

const activeMarathonDocument = graphql(
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

  const { data: activeMarathonResult, isLoading: activeMarathonResultLoading } =
    useTypedCustomQuery({
      document: activeMarathonDocument,
      props: {
        queryOptions: {
          enabled: valueOverride == null,
          queryKey: keys().data().resource("marathon").action("list").get(),
        },
      },
    });
  const { data: allMarathonsResult } = useTypedCustomQuery({
    document: allMarathonsDocument,
    props: {
      queryOptions: {
        enabled: canSeeMarathonList && valueOverride == null,
        queryKey: keys().data().resource("marathon").action("list").get(),
      },
    },
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
      : activeMarathonResult != null
        ? activeMarathonResult.data.latestMarathon
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

          allMarathonsResult?.data.marathons?.data ??
            (activeMarathonResult?.data.latestMarathon
              ? [activeMarathonResult.data.latestMarathon]
              : [])
        ),
        loading:
          activeMarathonResultLoading ||
          (marathonId != null && selectedMarathonResult.isLoading),
        source:
          marathonId != null && selectedMarathonResult.data != null
            ? "selected"
            : activeMarathonResult?.data != null
              ? "latest"
              : undefined,
      }}
    >
      {children}
    </marathonContext.Provider>
  );
};
