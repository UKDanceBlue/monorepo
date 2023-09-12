import { Image, ScrollView, Text, VStack } from "native-base";
import { RefreshControl, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NativeBaseMarkdown from "../../../../common/components/NativeBaseMarkdown";

import { useCurrentFirestoreHour } from "./FirestoreHourTypes";

export const HourScreenComponent = () => {
  const { width: screenWidth } = useWindowDimensions();

  // firestore hour
  const [
    isLoading,
    errorMessage,
    hourData,
    hourImage,
    refresh
  ] = useCurrentFirestoreHour();

  let hourDataComponent = null;
  if (hourData != null) {
    hourDataComponent = (
      <NativeBaseMarkdown style={{ text: { color: "#0f0f0f" } }}>
        {hourData.content}
      </NativeBaseMarkdown>
    );
  } else {
    hourDataComponent = (
      <Text variant="error-message">No hour data</Text>
    );
  }

  let hourImageComponent = null;
  if (hourImage != null) {
    hourImageComponent = (
      <Image
        width={screenWidth}
        height={screenWidth * hourImage.height / hourImage.width}
        alt="Hour Image"
        source={{
          uri: hourImage.url,
          height: hourImage.height,
          width: hourImage.width
        }}
        resizeMode="contain"/>
    );
  }

  return (
    <VStack
      flex={1}
      alignItems="center"
      flexDirection="column">
      {hourImageComponent}
      {
        errorMessage != null
          ? <Text flex={1} variant="error-message">{errorMessage}</Text>
          : null
      }
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <ScrollView
          marginX={4}
          marginTop={3}
          flex={1}
          width={screenWidth}
          contentContainerStyle={{ paddingBottom: 32, width: screenWidth-8, paddingHorizontal: 4 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refresh}
            />
          }>
          {hourDataComponent}
        </ScrollView>
      </SafeAreaView>
    </VStack>
  );
};
