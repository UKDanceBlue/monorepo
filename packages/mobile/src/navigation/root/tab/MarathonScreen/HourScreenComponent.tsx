import ImageView, {
  ImageViewFragment,
} from "@common/components/ImageView/ImageView";
import NativeBaseMarkdown from "@common/components/NativeBaseMarkdown";
import type { FragmentType } from "@ukdanceblue/common/dist/graphql-client-public";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/dist/graphql-client-public";
import { Heading, ScrollView, Text } from "native-base";
import { RefreshControl, useWindowDimensions } from "react-native";

const HourScreenFragment = graphql(/* GraphQL */ `
  fragment HourScreenFragment on MarathonHourResource {
    uuid
    title
    details
    durationInfo
    mapImages {
      ...ImageViewFragment
    }
  }
`);

export const HourScreenComponent = ({
  hourScreenFragment,
  isLoading,
  refresh,
}: {
  hourScreenFragment: FragmentType<typeof HourScreenFragment>;
  isLoading: boolean;
  refresh: () => void;
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const hourScreenData = getFragmentData(
    HourScreenFragment,
    hourScreenFragment
  );
  return (
    <ScrollView
      marginTop={3}
      flex={1}
      width={screenWidth}
      contentContainerStyle={{
        paddingBottom: 32,
      }}
      paddingX={2}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refresh} />
      }
    >
      <Heading textAlign="center" marginBottom={2}>
        {hourScreenData.title}
      </Heading>
      <Text
        textAlign="center"
        marginBottom={2}
        fontSize={18}
        fontFamily={"lightbody"}
      >
        {hourScreenData.durationInfo}
      </Text>
      {hourScreenData.mapImages.length > 0 && (
        <ScrollView
          width="full"
          flexDirection="row"
          height={screenHeight / 4}
          horizontal
          flex={1}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          {hourScreenData.mapImages.map((image, i) => (
            <ImageView
              key={getFragmentData(ImageViewFragment, image).uuid + i}
              imageFragment={image}
              contentFit="contain"
              renderHeight={screenHeight / 4}
              style={{ marginRight: 6 }}
            />
          ))}
        </ScrollView>
      )}
      <NativeBaseMarkdown>{hourScreenData.details}</NativeBaseMarkdown>
    </ScrollView>
  );
};
