import { dateTimeFromSomething } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "urql";

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
  query SelectedMarathon($marathonId: String!) {
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
}: {
  children: React.ReactNode;
}) => {
  const [marathonId, setMarathonId] = useState(
    localStorage.getItem(LocalStorageKeys.SelectedMarathon) || null
  );

  useEffect(() => {
    if (marathonId) {
      localStorage.setItem(LocalStorageKeys.SelectedMarathon, marathonId);
    } else {
      localStorage.removeItem(LocalStorageKeys.SelectedMarathon);
    }
  }, [marathonId]);

  const [latestMarathonResult] = useQuery({ query: latestMarathonDocument });
  const [selectedMarathonResult] = useQuery({
    query: selectedMarathonDocument,
    variables: { marathonId: marathonId ?? "" },
    pause: marathonId == null,
  });

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
