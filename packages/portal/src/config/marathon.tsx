import {
  AccessLevel,
  Action,
  dateTimeFromSomething,
} from "@ukdanceblue/common";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "urql";

import { graphql } from "#graphql/index.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";

import type { MarathonContextData } from "./marathonContext.js";
import { marathonContext } from "./marathonContext.js";
import { LocalStorageKeys } from "./storage.js";

const latestMarathonDocument = graphql(/* GraphQL */ `
  query ActiveMarathon {
    latestMarathon {
      id
      year
      startDate
      endDate
    }
  }
`);

const allMarathonsDocument = graphql(/* GraphQL */ `
  query AllMarathons {
    marathons(sendAll: true) {
      data {
        id
        year
      }
    }
  }
`);

const selectedMarathonDocument = graphql(/* GraphQL */ `
  query SelectedMarathon($marathonId: GlobalId!) {
    marathon(uuid: $marathonId) {
      id
      year
      startDate
      endDate
    }
  }
`);

export const MarathonConfigProvider = ({
  children,
  valueOverride,
}: {
  children: React.ReactNode;
  valueOverride?: Pick<MarathonContextData, "marathon" | "marathons">;
}) => {
  const canSeeMarathonList = useAuthorizationRequirement(
    Action.List,
    "MarathonNode"
  );

  const [marathonId, setMarathonId] = useState<string | null>(null);

  useEffect(() => {
    if (marathonId) {
      localStorage.setItem(LocalStorageKeys.SelectedMarathon, marathonId);
    } else {
      localStorage.removeItem(LocalStorageKeys.SelectedMarathon);
    }
  }, [marathonId]);

  const [latestMarathonResult] = useQuery({
    query: latestMarathonDocument,
    pause: valueOverride != null,
  });
  const [allMarathonsResult] = useQuery({
    query: allMarathonsDocument,
    pause: !canSeeMarathonList || valueOverride != null,
  });
  const [selectedMarathonResult] = useQuery({
    query: selectedMarathonDocument,
    variables: { marathonId: marathonId ?? "" },
    pause: marathonId == null || valueOverride != null,
  });

  useEffect(() => {
    const storedMarathonId = localStorage.getItem(
      LocalStorageKeys.SelectedMarathon
    );
    if (storedMarathonId) {
      if (
        allMarathonsResult.data?.marathons.data.some(
          (m) => m.id === storedMarathonId
        )
      ) {
        setMarathonId(storedMarathonId);
      } else {
        localStorage.removeItem(LocalStorageKeys.SelectedMarathon);
      }
    }
  }, [allMarathonsResult.data?.marathons.data]);

  let marathon = null;
  if (marathonId != null && selectedMarathonResult.data != null) {
    marathon = selectedMarathonResult.data.marathon;
  } else if (latestMarathonResult.data != null) {
    marathon = latestMarathonResult.data.latestMarathon;
  }

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
        marathons:
          allMarathonsResult.data?.marathons.data ??
          (latestMarathonResult.data?.latestMarathon
            ? [latestMarathonResult.data.latestMarathon]
            : []),
        loading:
          latestMarathonResult.fetching || selectedMarathonResult.fetching,
      }}
    >
      {children}
    </marathonContext.Provider>
  );
};
