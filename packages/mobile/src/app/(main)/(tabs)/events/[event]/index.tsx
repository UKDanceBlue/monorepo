import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { useQuery } from "urql";

import { graphql } from "~/api";

const EventDocument = graphql(/* GraphQL */ `
  query Event($id: GlobalId!) {
    event(id: $id) {
      id
      title
      summary
      description
      location
      occurrences {
        id
        interval {
          start
          end
        }
        fullDay
      }
      images {
        id
        url
        height
        width
        alt
        thumbHash
      }
    }
  }
`);

export default function Event() {
  const { event } = useLocalSearchParams<"/events/[event]">();
  const { setOptions } = useNavigation("/events/[event]");

  const [data] = useQuery({
    query: EventDocument,
    variables: { id: event },
  });
  useEffect(() => {
    setOptions({
      headerTitle: data.data?.event?.title ?? "",
    });
    return () => setOptions({ headerTitle: "" });
  });
}
