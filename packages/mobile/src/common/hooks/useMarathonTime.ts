import { SimpleConfigFragment } from "@common/fragments/Configuration";
import { log, logError } from "@common/logging";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/dist/graphql-client-public";
import { DateTime } from "luxon";
import { useEffect, useMemo } from "react";
import { useQuery } from "urql";

export interface MarathonTime {
  startTime: DateTime,
  endTime: DateTime,
}

const useMarathonStartQuery = graphql(/* GraphQL */ `
  query useMarathonStart {
    activeConfiguration(key: "MARATHON_START") {
      data {
        ...SimpleConfig
      }
    }
  }
`);

const useMarathonEndQuery = graphql(/* GraphQL */ `
  query useMarathonEnd {
    activeConfiguration(key: "MARATHON_END") {
      data {
        ...SimpleConfig
      }
    }
  }
`);

export function useMarathonTime(): {
  timesLoading: boolean;
  marathonTime: MarathonTime;
} {
  const [{ data: startData, fetching: startFetch, error: startError }] = useQuery({
    query: useMarathonStartQuery,
  });

  const startValue = getFragmentData(
    SimpleConfigFragment,
    startData?.activeConfiguration.data
  );

  const [{ data: endData, fetching: endFetch, error: endError }] = useQuery({
    query: useMarathonEndQuery,
  });

  const endValue = getFragmentData(
    SimpleConfigFragment,
    endData?.activeConfiguration.data
  );

  useEffect(() => {
    if (startError) {
      logError(startError);
    }
    if (endError) {
      logError(endError);
    }
  });

  const determineMarathonIntervals = useMemo(() => {
    let startTime: DateTime = DateTime.fromMillis(0);
    let endTime: DateTime = DateTime.fromMillis(0);

    try {
      if (startValue) {
        const parsed = startValue.value;
        startTime = DateTime.fromISO(parsed);
        if (!startTime.isValid) {
          log(`Unrecognized marathon start time: ${startTime.toString()}`, "warn");
        }
      }

      if (endValue) {
        const parsed = endValue.value;
        endTime = DateTime.fromISO(parsed);
        if (!endTime.isValid) {
          log(`Unrecognized marathon end time: ${endTime.toString()}`, "warn");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        logError(error);
      } else {
        log(String(error), "error");
      }
    }

    return({startTime, endTime} as MarathonTime);

  }, [startValue, endValue]);


  return {
    timesLoading: (startFetch || endFetch),
    marathonTime: determineMarathonIntervals
  };
}
