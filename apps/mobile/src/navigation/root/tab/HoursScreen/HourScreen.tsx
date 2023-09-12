/*
import { MaterialIcons } from "@expo/vector-icons";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import type { StackScreenProps } from "@react-navigation/stack";
import { setStringAsync as setClipboardStringAsync } from "expo-clipboard";
import { openBrowserAsync } from "expo-web-browser";
import { Button, Image, Text, View, useTheme } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, useWindowDimensions } from "react-native";

import { UseCachedFilesType, useCachedImages } from "../../../../common/cacheUtils";
import { universalCatch } from "../../../../common/logging";
import { showPrompt } from "../../../../common/util/alertUtils";
import { HourInstructionsType } from "../../../../types/hourScreenTypes";
import { RootStackParamList } from "../../../../types/navigationTypes";

import HourActivities, { DadJokeLeaderboard, PhotoUpload } from "./HourActivities";

type Props = StackScreenProps<RootStackParamList, "Hour Details">;

function composeInstructions(hourInstructions: HourInstructionsType) {
  let tempHourInstructionsText = "";
  // If it's a flat string, just return that
  if (typeof hourInstructions === "string") {
    return hourInstructions;
  }
  // If it's an array iterate over it and assemble a list of instructions
  if (Array.isArray(hourInstructions)) {
    for (let i = 0; i < hourInstructions.length; i++) {
      const hourInstruction = hourInstructions[i];
      // Is this an instruction that we want to be a level lower
      if (Array.isArray(hourInstruction)) {
        // Add a top level instruction as the first array element
        tempHourInstructionsText += `${i + 1}. ${hourInstruction[0]}
`;
        // Start at the second element, assuming the first is the top level instruction
        for (
          let j = 1;
          j < Object.keys(hourInstruction).length && j - 1 < alphabet.length;
          j++
        ) {
          tempHourInstructionsText += `      ${alphabet[j - 1]}. ${hourInstruction[j]}
`;
        }
        // Otherwise just add it as a normal element
      } else {
        const instruction = hourInstructions[i];
        tempHourInstructionsText += `${i + 1}. ${Array.isArray(instruction) ? instruction.join() : instruction}
`;
      }
    }
  }

  return tempHourInstructionsText;
}

const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const HourScreen = ({ route: { params: { firestoreHour } } }: { route: Props["route"] }) => {
  const [ components, setComponents ] = useState<JSX.Element[]>([]);
  const [ cacheOptions, setCacheOptions ] = useState<UseCachedFilesType[]>([]);
  const cachedImages = useCachedImages(cacheOptions);
  const { colors } = useTheme();

  const {
    width: screenWidth, height: screenHeight
  } = useWindowDimensions();

  // Setup the image cache
  useEffect(() => {
    const tempCacheOptions: UseCachedFilesType[] = [];
    let googleUriIndex = 0;
    let httpUriIndex = 0;
    for (let i = 0; i < firestoreHour.contentOrder.length; i++) {
      switch (firestoreHour.contentOrder[i]) {
      case "http-image": {
        const cacheOption: UseCachedFilesType = {
          assetId: `Marathon Hour: ${firestoreHour.name} http file #${httpUriIndex}`,
          freshnessTime: 14400,
          base64: true,
          downloadUri: Array.isArray(firestoreHour.imageUri)
            ? firestoreHour.imageUri[httpUriIndex]
            : firestoreHour.imageUri,
        };
        tempCacheOptions[i] = cacheOption;
        httpUriIndex++;
        break;
      }
      case "gs-image": {
        const cacheOption: UseCachedFilesType = {
          assetId: `Marathon Hour: ${firestoreHour.name} google storage file #${googleUriIndex}`,
          freshnessTime: 14400,
          base64: true,
          googleUri: Array.isArray(firestoreHour.firebaseImageUri)
            ? firestoreHour.firebaseImageUri[googleUriIndex]
            : firestoreHour.firebaseImageUri,
        };
        tempCacheOptions[i] = cacheOption;
        googleUriIndex++;
        break;
      }
      default: {
        break;
      }
      }
    }
    setCacheOptions(tempCacheOptions);
  }, [firestoreHour]);

  // Build out the screen's components
  useEffect(() => {
    const tempComponents: JSX.Element[] = [];
    let specialComponentIndex = 0;
    let buttonIndex = 0;
    let textBlockIndex = 0;
    for (let i = 0; i < firestoreHour.contentOrder.length; i++) {
      switch (firestoreHour.contentOrder[i]) {
      case "text-instructions":
        if (firestoreHour.textInstructions) {
          tempComponents.push(
            <>
              <Text style={{ margin: 10 }} key={`${i}a`}>
                  Instructions:
              </Text>
              <Text style={{ margin: 10 }} key={`${i}b`}>
                {composeInstructions(firestoreHour.textInstructions)}
              </Text>
            </>
          );
        }
        break;
      case "text-block":
        if (Array.isArray(firestoreHour.textBlock)) {
          tempComponents.push(
            <Text style={{ margin: 10 }} key={i}>
              {firestoreHour.textBlock[textBlockIndex]}
            </Text>
          );
        } else {
          tempComponents.push(
            <Text style={{ margin: 10 }} key={i}>
              {firestoreHour.textBlock}
            </Text>
          );
        }
        textBlockIndex++;
        break;

      case "gs-image":
      case "http-image":
        if (cachedImages[i]) {
          if (cachedImages[i][1] !== null) {
            tempComponents.push(
              <MaterialIcons key={i} name="image-not-supported" color="black" />
            );
          } else if (cachedImages[i][0] !== null) {
            tempComponents.push(
              <ReactNativeZoomableView
                maxZoom={3}
                minZoom={1}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders
                style={{ padding: 10 }}
                movementSensibility={5}
              >
                <Image
                  source={{
                    uri: cachedImages[i][0]?.imageBase64,
                    width: cachedImages[i][0]?.imageWidth,
                    height: cachedImages[i][0]?.imageHeight,
                  }}
                  style={{
                    resizeMode: "contain",
                    alignSelf: "center",
                    margin: 10,
                  }}
                  width={screenWidth - 20}
                  height={screenWidth / (cachedImages[i][0]?.imageRatio ?? 1)}
                />
              </ReactNativeZoomableView>
            );
          } else {
            tempComponents.push(<ActivityIndicator key={i} color="blue" />);
          }
        } else {
          tempComponents.push(<ActivityIndicator key={i} color="blue" style={{ padding: 10 }} />);
        }
        break;

      case "special":
        if (Array.isArray(firestoreHour.specialComponent)) {
          tempComponents.push(
            <View key={i}>
              {HourActivities[firestoreHour.specialComponent[specialComponentIndex].id]}
            </View>
          );
        } else if (firestoreHour.specialComponent) {
          tempComponents.push(
            <View key={i}>{HourActivities[firestoreHour.specialComponent.id]}</View>
          );
        }
        specialComponentIndex++;
        break;

      case "photo-upload":
        tempComponents.push(<PhotoUpload key={i} />);
        break;

      case "dad-joke-leaderboard":
        tempComponents.push(<DadJokeLeaderboard key={i} />);
        break;

      case "button":
        if (Array.isArray(firestoreHour.buttonConfig)) {
          const buttonText = firestoreHour.buttonConfig[buttonIndex].text;
          const buttonUrl = firestoreHour.buttonConfig[buttonIndex].url;
          tempComponents.push(
            <View key={i}>
              <Button
                buttonStyle={{ marginHorizontal: 15, marginVertical: 5 }}
                title={buttonText}
                onPress={() => {
                  openBrowserAsync(buttonUrl).catch(universalCatch);
                }}
                onLongPress={() => {
                  showPrompt("Would you like to copy the link?", "Copy link", undefined, () => {
                    setClipboardStringAsync(buttonUrl).catch(universalCatch);
                  });
                }}
              />
            </View>
          );
        } else if (firestoreHour.buttonConfig) {
          const buttonText = firestoreHour.buttonConfig.text;
          const buttonUrl = firestoreHour.buttonConfig.url;
          tempComponents.push(
            <View key={i}>
              <Button
                buttonStyle={{ marginHorizontal: 15, marginVertical: 5 }}
                title={buttonText}
                onPress={() => {
                  openBrowserAsync(buttonUrl).catch(universalCatch);
                }}
              />
            </View>
          );
        }
        buttonIndex++;
        break;

      default:
        break;
      }
    }
    setComponents(tempComponents);
  }, [
    cachedImages, firestoreHour, screenHeight, screenWidth
  ]);

  return (
    <ScrollView style={{ backgroundColor: colors.gray[500] }}>
      <View style={{ justifyContent: "space-between" }}>
        <Text h="3" style={{ margin: 10 }}>{`${
          firestoreHour.hourNumber + 1
        }. ${firestoreHour.name}`}</Text>
        {firestoreHour.description && (
          <Text style={{ margin: 10 }}>{firestoreHour.description}</Text>
        )}
        {components}
      </View>
    </ScrollView>
  );
};

export default HourScreen;
*/
