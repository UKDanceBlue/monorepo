import { dateTimeFromSomething } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/dist/graphql-client-public";
import { Text } from "native-base";
import { useEffect } from "react";
import { useQuery } from "urql";

import { HourScreenComponent } from "./HourScreenComponent";
import { MarathonCountdownScreen } from "./MarathonCountdownScreen";

const marathonScreenDocument = graphql(/* GraphQL */ `
  query MarathonScreen {
    currentMarathonHour {
      ...HourScreenFragment
    }
    currentMarathon {
      year
    }
    nextMarathon {
      year
      startDate
      endDate
    }
  }
`);

export const MarathonScreen = () => {
  const [{ fetching, data, error }, refresh] = useQuery({
    query: marathonScreenDocument,
  });

  useEffect(() => {
    // This is just a polling timer to refresh the data every minute
    // in case the server has updated the marathon hour
    const interval = setInterval(() => {
      refresh({ requestPolicy: "network-only" });
    }, 60_000);

    return () => {
      clearInterval(interval);
    };
  }, [refresh]);

  useEffect(() => {
    // This one is to check if we should be within the marathon's time frame
    // If we are, rather than assuming we are, we should refresh the data
    // to ensure we're showing the correct screen
    const interval = setInterval(() => {
      if (!data?.currentMarathonHour && data?.nextMarathon?.startDate) {
        const now = new Date();
        const marathonStart = new Date(data.nextMarathon.startDate);
        if (now >= marathonStart) {
          // refresh({ requestPolicy: "network-only" });
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [data?.nextMarathon?.startDate, data?.currentMarathonHour, refresh]);

  if (error) {
    // TODO: Handle error
    return <Text> {JSON.stringify(error)}</Text>;
  }

  if (data?.currentMarathonHour) {
    return (
      <HourScreenComponent
        hourScreenFragment={data.currentMarathonHour}
        isLoading={fetching}
        refresh={refresh}
      />
    );
  }

  if (data?.nextMarathon?.year) {
    return (
      <MarathonCountdownScreen
        marathonYear={data.nextMarathon.year}
        marathonStart={dateTimeFromSomething(data.nextMarathon.startDate)}
        marathonEnd={dateTimeFromSomething(data.nextMarathon.endDate)}
      />
    );
  }

  return <Text> {JSON.stringify(data)}</Text>;
};
