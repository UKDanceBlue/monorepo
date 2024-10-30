import { dateTimeFromSomething } from "@ukdanceblue/common";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "urql";

import { graphql } from "#graphql/index.js";

import type { MarathonContextData } from "./marathonContext";
import { marathonContext } from "./marathonContext";
import { LocalStorageKeys } from "./storage";

const latestMarathonDocument = graphql(/* GraphQL */ `
  query ActiveMarathon {
    latestMarathon {
      id
      year
      startDate
      endDate
    }
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
        latestMarathonResult.data?.marathons.data.some(
          (m) => m.id === storedMarathonId
        )
      ) {
        setMarathonId(storedMarathonId);
      } else {
        localStorage.removeItem(LocalStorageKeys.SelectedMarathon);
      }
    }
  }, [latestMarathonResult.data?.marathons.data]);

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
        marathons: latestMarathonResult.data?.marathons.data ?? [],
        loading:
          latestMarathonResult.fetching || selectedMarathonResult.fetching,
      }}
    >
      {children}
    </marathonContext.Provider>
  );
};
