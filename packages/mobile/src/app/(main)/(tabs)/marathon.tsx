import { Image } from "expo-image";
import { DateTime } from "luxon";
import { ActivityIndicator, View } from "react-native";
import { useQuery } from "urql";

import { graphql } from "~/api";
import { Markdown } from "~/components/ui/markdown";
import { Pager } from "~/components/ui/pager";
import { Text } from "~/components/ui/text";
import { H3 } from "~/components/ui/typography";

export default function Marathon() {
  const [{ data, fetching, error }] = useQuery({
    query: graphql(/* graphql */ `
      query Marathon {
        latestMarathon {
          id
          startDate
          endDate
          year
        }
        currentMarathonHour {
          id
          title
          durationInfo
          details
          mapImages {
            id
            url
            width
            height
            alt
            thumbHash
          }
        }
      }
    `),
  });

  if (fetching || !data?.latestMarathon) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <Text className="text-danger">Error: {error.message}</Text>
      </View>
    );
  }

  console.log("Marathon data", data);

  if (data.currentMarathonHour != null) {
    const { mapImages, title, durationInfo, details } =
      data.currentMarathonHour;

    return (
      <View className="flex flex-1 bg-blue-500">
        <View className="flex flex-0">
          <Pager>
            {mapImages.map((image) => (
              <Image
                key={image.id}
                source={{
                  uri: image.url,
                  height: image.height,
                  width: image.width,
                  thumbHash: image.thumbHash,
                }}
                alt={image.alt ?? undefined}
                contentFit="cover"
                className="w-screen max-h-[35vh]"
                style={{ aspectRatio: image.width / image.height }}
              />
            ))}
          </Pager>
        </View>
        <View className="flex flex-1 justify-start items-center">
          <H3 className="text-white text-center mt-2">{title}</H3>
          <Text className="text-white text-center mt-2">{durationInfo}</Text>
          <Markdown
            style={{
              text: {
                color: "#fff",
              },
            }}
          >
            {`1. danger
            2. ree`}
          </Markdown>
        </View>
      </View>
    );
  }

  const marathonStart =
    data.latestMarathon.startDate != null
      ? DateTime.fromISO(data.latestMarathon.startDate)
      : null;
  const marathonEnd =
    data.latestMarathon.endDate != null
      ? DateTime.fromISO(data.latestMarathon.endDate)
      : null;

  return <Text className="text-center mt-2">Marathon is not active</Text>;
}
