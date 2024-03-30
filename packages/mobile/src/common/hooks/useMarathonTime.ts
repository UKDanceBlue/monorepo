import { Logger } from "@common/logger/Logger";
import { dateTimeFromSomething } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/dist/graphql-client-public";
import { DateTime } from "luxon";
import { useEffect, useMemo } from "react";
import { useQuery } from "urql";

export interface MarathonTime {
  startTime: DateTime;
  endTime: DateTime;
}

const marathonTimeQuery = graphql(/* GraphQL */ `
  query MarathonTime {
    nextMarathon {
      startDate
      endDate
    }
  }
`);

export function useMarathonTime(): {
  timesLoading: boolean;
  marathonTime: MarathonTime;
} {
  const [{ data, fetching, error }] = useQuery({
    query: marathonTimeQuery,
  });

  useEffect(() => {
    if (error) {
      Logger.error("Failed to fetch marathon start time", {
        error,
        source: "useMarathonTime",
      });
    }
  });

  const marathonInterval = useMemo(() => {
    let startTime: DateTime = DateTime.fromMillis(0);
    let endTime: DateTime = DateTime.fromMillis(0);

    try {
      if (data?.nextMarathon) {
        startTime = dateTimeFromSomething(data.nextMarathon.startDate);
        if (!startTime.isValid) {
          Logger.warn(
            `Unrecognized marathon start time: ${startTime.toString()}`,
            {
              source: "useMarathonTime",
            }
          );
        }
        endTime = dateTimeFromSomething(data.nextMarathon.endDate);
        if (!endTime.isValid) {
          Logger.warn(`Unrecognized marathon end time: ${endTime.toString()}`, {
            source: "useMarathonTime",
          });
        }
      }
    } catch (error) {
      Logger.error("Failed to determine marathon intervals", {
        error,
        source: "useMarathonTime",
      });
    }

    return { startTime, endTime } as MarathonTime;
  }, [data?.nextMarathon]);

  return {
    timesLoading: fetching,
    marathonTime: marathonInterval,
  };
}
