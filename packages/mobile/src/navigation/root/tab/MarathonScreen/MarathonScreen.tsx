import { Logger } from "@common/logger/Logger";
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
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [refresh]);

  if (error) {
    Logger.error("A graphql error occurred", {
      error,
      source: "MarathonScreen",
    });
    return (
      <Text width="full" height="full" textAlign="center">
        Something went Wrong!
      </Text>
    );
  }

  if (data?.currentMarathonHour) {
    return (
      <HourScreenComponent
        hourScreenFragment={data.currentMarathonHour}
        isLoading={fetching && !data.currentMarathonHour}
        refresh={() => refresh({ requestPolicy: "network-only" })}
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
