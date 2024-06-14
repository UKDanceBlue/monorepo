import { dateTimeFromSomething } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { useState } from "react";
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

  return (
    <marathonContext.Provider
      value={{
        setMarathon: setMarathonId,
        marathon: marathon
          ? {
              id: marathon.id,
              year: marathon.year,
              startDate: dateTimeFromSomething(marathon.startDate) ?? null,
              endDate: dateTimeFromSomething(marathon.endDate) ?? null,
            }
          : null,
      }}
    >
      {children}
    </marathonContext.Provider>
  );
};
