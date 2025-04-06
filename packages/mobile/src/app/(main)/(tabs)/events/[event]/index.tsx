import { Image, type ImageSource } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { View } from "react-native";
import { useQuery } from "urql";

import { graphql } from "~/api";
import { Markdown } from "~/components/ui/markdown";
import { Text } from "~/components/ui/text";

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

  return (
    <View className="flex-1 p-4 pt-2 bg-background dark:bg-backgroundDark text-foreground dark:text-foregroundDark">
      {data.data?.event?.images.map((image) => {
        return (
          <Image
            key={image.id}
            source={
              {
                uri: image.url ?? undefined,
                width: image.width,
                height: image.height,
                thumbhash: image.thumbHash ?? undefined,
              } satisfies ImageSource
            }
            alt={image.alt ?? undefined}
            className="w-full rounded-lg my-2"
            style={{
              aspectRatio: image.width / image.height,
            }}
            contentFit="cover"
          />
        );
      })}
      <Markdown>{data.data?.event?.description ?? ""}</Markdown>
      {data.data?.event?.location && (
        <Text className="text-sm text-muted-foreground dark:text-muted-foregroundDark text-center">
          {data.data.event.location}
        </Text>
      )}
      {data.data?.event?.occurrences.map((occurrence) => {
        const start = DateTime.fromISO(
          occurrence.interval.start
        ).toLocaleString(
          occurrence.fullDay ? DateTime.DATE_MED : DateTime.DATETIME_MED
        );
        const end = DateTime.fromISO(occurrence.interval.end).toLocaleString(
          occurrence.fullDay ? DateTime.DATE_MED : DateTime.DATETIME_MED
        );
        return (
          <Text
            className="text-sm text-muted-foreground dark:text-muted-foregroundDark text-center"
            key={occurrence.id}
          >
            {start === end ? start : `${start} - ${end}`}
          </Text>
        );
      })}
    </View>
  );
}
