import { Heading, ScrollView, Text } from "native-base";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";

import ImageView, {
  ImageViewFragment,
} from "@/common/components/ImageView/ImageView";
import NativeBaseMarkdown from "@/common/components/NativeBaseMarkdown";
import { TriviaCrack } from "@/common/marathonComponents/TriviaCrack";
import type { FragmentOf } from "@/graphql/index";
import { graphql, readFragment } from "@/graphql/index";

export const HourScreenFragment = graphql(
  /* GraphQL */ `
    fragment HourScreenFragment on MarathonHourNode {
      id
      title
      details
      durationInfo
      mapImages {
        ...ImageViewFragment
      }
    }
  `,
  [ImageViewFragment]
);

export const HourScreenComponent = ({
  hourScreenFragment,
  isLoading,
  refresh,
  showSecretMenu,
}: {
  hourScreenFragment: FragmentOf<typeof HourScreenFragment>;
  isLoading: boolean;
  refresh: () => void;
  showSecretMenu: () => void;
}) => {
  const [secretGestureState, setSecretGestureState] = useState<number>(0);

  useEffect(() => {
    if (secretGestureState === 15) {
      setSecretGestureState(0);
      showSecretMenu();
    }
  }, [secretGestureState, showSecretMenu]);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const hourScreenData = readFragment(HourScreenFragment, hourScreenFragment);
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
      <TouchableWithoutFeedback
        onPress={() =>
          setSecretGestureState((old) => (old >= 5 && old < 10 ? old + 1 : 0))
        }
      >
        <Heading textAlign="center" marginBottom={2} suppressHighlighting>
          {hourScreenData.title}
        </Heading>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() =>
          setSecretGestureState((old) => (old < 5 || old >= 10 ? old + 1 : 0))
        }
      >
        <Text
          textAlign="center"
          marginBottom={2}
          fontSize={18}
          fontFamily={"lightbody"}
          suppressHighlighting
        >
          {hourScreenData.durationInfo}
        </Text>
      </TouchableWithoutFeedback>
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
              key={`${readFragment(ImageViewFragment, image).id}-${i}`}
              imageFragment={image}
              contentFit="contain"
              renderHeight={screenHeight / 4}
              style={{ marginRight: 6 }}
            />
          ))}
        </ScrollView>
      )}
      {hourScreenData.title === "Trivia Crack" && <TriviaCrack />}
      <NativeBaseMarkdown>{hourScreenData.details ?? ""}</NativeBaseMarkdown>
    </ScrollView>
  );
};
