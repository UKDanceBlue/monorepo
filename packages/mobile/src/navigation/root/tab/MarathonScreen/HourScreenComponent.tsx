import NativeBaseMarkdown from "@common/components/NativeBaseMarkdown";
import type { FragmentType } from "@ukdanceblue/common/dist/graphql-client-public";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/dist/graphql-client-public";
import { Heading, ScrollView, Text, VStack } from "native-base";
import { RefreshControl, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HourScreenFragment = graphql(/* GraphQL */ `
  fragment HourScreenFragment on MarathonHourResource {
    uuid
    title
    details
    durationInfo
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
  const { width: screenWidth } = useWindowDimensions();

  const hourScreenData = getFragmentData(
    HourScreenFragment,
    hourScreenFragment
  );

  let hourImageComponent = null;
  hourImageComponent = null;

  // TODO: Once image support is worked out, uncomment this
  // if (hourImage != null) {
  //   hourImageComponent = (
  //     <Image
  //       width={screenWidth}
  //       height={(screenWidth * hourImage.height) / hourImage.width}
  //       alt="Hour Image"
  //       source={{
  //         uri: hourImage.url,
  //         height: hourImage.height,
  //         width: hourImage.width,
  //       }}
  //       resizeMode="contain"
  //     />
  //   );
  // }

  return (
    <VStack flex={1} alignItems="center" flexDirection="column">
      {hourImageComponent}
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <ScrollView
          marginX={4}
          marginTop={3}
          flex={1}
          width={screenWidth}
          contentContainerStyle={{
            paddingBottom: 32,
            width: screenWidth - 8,
            paddingHorizontal: 4,
          }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refresh} />
          }
        >
          <Heading textAlign="center" marginBottom={2}>
            {hourScreenData.title}
          </Heading>
          <Text textAlign="center" marginBottom={2}>
            {hourScreenData.durationInfo}
          </Text>
          <NativeBaseMarkdown>{hourScreenData.details}</NativeBaseMarkdown>
        </ScrollView>
      </SafeAreaView>
    </VStack>
  );
};
