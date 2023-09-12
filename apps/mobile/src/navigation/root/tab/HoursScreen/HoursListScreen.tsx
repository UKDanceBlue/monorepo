/*
import { useNavigation } from "@react-navigation/native";
import { DateTime, Interval } from "luxon";
import { Button, Divider, Image, Text, View } from "native-base";
import { useEffect, useState } from "react";
import { FlatList, useWindowDimensions } from "react-native";

import { useCachedFiles } from "../../../../common/cacheUtils";
import { useAppSelector, useCurrentDate } from "../../../../common/customHooks";
import { universalCatch } from "../../../../common/logging";
import { FirestoreHour } from "../../../../types/firebaseTypes";
import { TabNavigatorProps } from "../../../../types/navigationTypes";

function revealRandomChars(input: string, charsToReveal: number): string {
  let tempOutputString = "";
  for (const char of input) {
    if (char === " ") {
      tempOutputString += " ";
    } else {
      tempOutputString += "■";
    }
  }

  // Get a seed number that is reliable between runs
  let seedNumber = 0;
  for (let i = 0; i < input.length; i++) {
    seedNumber += input.charCodeAt(i);
  }

  for (let i = 0; i < charsToReveal; i++) {
    const inputIndex = Math.floor(input.length * ((Math.sin(seedNumber * i) + 1) / 2));
    tempOutputString = tempOutputString.substring(0, inputIndex) +
      input[inputIndex] +
      tempOutputString.substring(inputIndex + 1);
  }
  return tempOutputString;
}
interface FirestoreHourWithKey extends FirestoreHour {
  key: number;
}

const HourRow = ({
  firestoreHour,
  marathonHour,
  currentMinute,
}: {
  firestoreHour: FirestoreHour;
  marathonHour: number;
  currentMinute: number;
}) => {
  const {
    name: hourName, hourNumber
  } = firestoreHour;
  const navigation = useNavigation<TabNavigatorProps<"Marathon">["navigation"]>();
  const [ displayedName, setDisplayedName ] = useState("");
  const [ clickable, setClickable ] = useState(false);

  // TODO change this so it looks like wordle and reveals random letters up to half of the name; whole name at the hour so reveal stays fresh
  // Maybe choose which to reveal based on hash of name? Need to be the same every time
  useEffect(() => {
    let tempDisplayedName = "";

    if (marathonHour + 1 > hourNumber) {
      tempDisplayedName = hourName;
      setClickable(true);
    } else {
      // Should we check if we should start revealing this one?
      setClickable(false);
      if (marathonHour === hourNumber - 1) {
        const hourPercent = (currentMinute + 1) / 60;
        const percentNameToShow = (hourPercent - 0.75) * 4;
        const charsToShow = percentNameToShow > 0 ? Math.trunc(hourName.length * percentNameToShow) : 0;
        tempDisplayedName = revealRandomChars(hourName, charsToShow);
      } else {
        for (const char of hourName) {
          if (char === " ") {
            tempDisplayedName += " ";
          } else {
            tempDisplayedName += "■";
          }
        }
      }
    }
    setDisplayedName(tempDisplayedName);
  }, [
    currentMinute, hourName, hourNumber, marathonHour
  ]);

  return (
    <Button
      onPress={
        clickable ? () => navigation.navigate("Hour Details", { firestoreHour }) : undefined
      }
      disabled={!clickable}
      key={hourNumber}
    >
      <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
        <Text h="4" style={{ fontSize: 19 }}>{`${hourNumber + 1}. `}</Text>
        <Text h="4" style={{ fontSize: 19 }}>
          {displayedName}
        </Text>
      </View>
      {/* {clickable && <ListItem.Chevron tvParallaxProperties={undefined} />} /}
    </Button>
  );
};

const HoursListScreen = () => {
  const firestoreHours = useAppSelector((state) => state.marathon.marathonHours);
  const [ firestoreHoursWithKeys, setFirestoreHoursWithKeys ] = useState<FirestoreHourWithKey[]>([]);
  const isConfigLoaded = useAppSelector((state) => state.appConfig.isConfigLoaded);
  const currentDate = useCurrentDate();
  const [ marathonHour, setMarathonHour ] = useState(-1);
  const { width: screenWidth } = useWindowDimensions();
  const [mapOfMemorial] = useCachedFiles([
    {
      assetId: "DB22 Memorial Map",
      googleUri: "gs://react-danceblue.appspot.com/marathon/2022/maps/Overall Map.png",
      freshnessTime: 86400,
      base64: true,
    },
  ]);

  useEffect(() => {
    setFirestoreHoursWithKeys(
      firestoreHours.map((firestoreHour) => ({
        key: firestoreHour.hourNumber,
        ...firestoreHour,
      }))
    );
  }, [firestoreHours]);

  useEffect(() => {
    // First programmed hour is 8:00pm or 20:00
    // Marathon is March 5th and 6th, I am hardcoding this, hope that causes no issues
    // This will set the hour to a negative number if the marathon has yet to start and should be between 0 and 23 for the duration of the marathon
    const tempMarathonHour = 23 - Interval.fromDateTimes(DateTime.fromObject({ year: 2022, month: 2, day: 6, hour: 20 }), DateTime.fromJSDate(currentDate)).toDuration().as("hours");
    setMarathonHour(tempMarathonHour > 23 ? 23 : tempMarathonHour);
  }, [currentDate]);

  return (
    <View style={{ flex: 1 }}>
      {/* marathonHour < 0 && isConfigLoaded && countdown && (
        <>
          <View style={{ flexGrow: 1, flexShrink: 0 }}>
            <CountdownView />
          </View>
          <View style={{ flexGrow: 2, height: 0 }} />
        </>
      )/}
      {marathonHour >= 0 && (
        <>
          {mapOfMemorial && (
            <>
              <Divider width={2} />
              <Image
                source={{ uri: `data:image/png;base64,${mapOfMemorial}` }}
                width={screenWidth}
                height={screenWidth * (1194 / 1598)}
              />
              <Divider width={2} />
            </>
          )}
          <FlatList
            data={firestoreHoursWithKeys.sort((a, b) => a.key - b.key)}
            renderItem={(itemInfo) => (
              <HourRow
                firestoreHour={itemInfo.item}
                marathonHour={marathonHour}
                currentMinute={currentDate.getMinutes()}
              />
            )}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "#000",
                }}
              />
            )}
            refreshing={!isConfigLoaded}
            onRefresh={() => {
              store.dispatch(resetConfig());
              store.dispatch(updateConfig()).catch(universalCatch);
            }}
          />
        </>
      )}
    </View>
  );
};

export default HoursListScreen;
*/
