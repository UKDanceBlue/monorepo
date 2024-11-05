import { dateTimeFromSomething } from "@ukdanceblue/common";
import { Button, Modal, Text, View } from "native-base";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useQuery } from "urql";

import { useNetworkStatus } from "#common/customHooks.js";
import { Logger } from "#common/logger/Logger.js";
import { graphql } from "#graphql/index.js";

import { HourScreenComponent } from "./HourScreenComponent";
import { MarathonCountdownScreen } from "./MarathonCountdownScreen";

const marathonScreenDocument = graphql(/* GraphQL */ `
  query MarathonScreen {
    currentMarathonHour {
      ...HourScreenFragment
    }
    latestMarathon {
      startDate
      endDate
      hours {
        ...HourScreenFragment
      }
    }
  }
`);

export const MarathonScreen = () => {
  const { height: vpHeight, width: vpWidth } = useWindowDimensions();
  const [{ isInternetReachable }] = useNetworkStatus();

  const [{ fetching, data, error }, refresh] = useQuery({
    query: marathonScreenDocument,
  });
  const [lastGoodData, setLastGoodData] = useState(data);
  useEffect(() => {
    if (data?.currentMarathonHour || data?.latestMarathon) {
      setLastGoodData(data);
    }
  }, [data]);

  const [hourOverride, setHourOverride] = useState<number | undefined>(
    undefined
  );
  const [showSecretMenu, setShowSecretMenu] = useState(false);
  const [secretMenuText, setSecretMenuText] = useState("");

  useEffect(() => {
    // This is just a polling timer to refresh the data every minute
    // in case the server has updated the marathon hour
    const interval = setInterval(() => {
      if (isInternetReachable) refresh({ requestPolicy: "network-only" });
    }, 15_000);

    return () => {
      clearInterval(interval);
    };
  }, [isInternetReachable, refresh]);

  useEffect(() => {
    if (error) {
      Logger.error("A graphql error occurred", {
        error,
        source: "MarathonScreen",
        tags: ["graphql"],
      });
    }
  }, [error]);

  const component = useMemo(() => {
    if (isInternetReachable === false) {
      return (
        <Text width="full" height="full" textAlign="center">
          No Internet Connection, cannot load marathon information
        </Text>
      );
    } else if (lastGoodData?.latestMarathon && hourOverride != null) {
      if (hourOverride < 0) {
        return (
          <MarathonCountdownScreen
            marathonStart={
              dateTimeFromSomething(lastGoodData.latestMarathon.startDate) ??
              null
            }
            marathonEnd={
              dateTimeFromSomething(lastGoodData.latestMarathon.endDate) ?? null
            }
            showSecretMenu={() => setShowSecretMenu(true)}
          />
        );
      } else {
        return (
          <HourScreenComponent
            hourScreenFragment={lastGoodData.latestMarathon.hours[hourOverride]}
            isLoading={fetching && !lastGoodData.latestMarathon}
            refresh={() => refresh({ requestPolicy: "network-only" })}
            showSecretMenu={() => setShowSecretMenu(true)}
          />
        );
      }
    } else if (lastGoodData?.currentMarathonHour) {
      return (
        <HourScreenComponent
          hourScreenFragment={lastGoodData.currentMarathonHour}
          isLoading={fetching && !lastGoodData.currentMarathonHour}
          refresh={() => refresh({ requestPolicy: "network-only" })}
          showSecretMenu={() => setShowSecretMenu(true)}
        />
      );
    } else if (lastGoodData?.latestMarathon) {
      return (
        <MarathonCountdownScreen
          marathonStart={
            dateTimeFromSomething(lastGoodData.latestMarathon.startDate) ?? null
          }
          marathonEnd={
            dateTimeFromSomething(lastGoodData.latestMarathon.endDate) ?? null
          }
          showSecretMenu={() => setShowSecretMenu(true)}
        />
      );
    } else if (error) {
      return (
        <Text width="full" height="full" textAlign="center">
          Something went Wrong!
        </Text>
      );
    } else {
      Logger.info("MarathonScreen has invalid data", {
        source: "MarathonScreen",
        context: {
          latestMarathon: lastGoodData?.latestMarathon,
          currentHour: lastGoodData?.currentMarathonHour,
        },
      });
      return (
        <View
          flex={1}
          height={vpHeight}
          width={vpWidth}
          justifyContent="center"
          alignItems="center"
        >
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }, [
    error,
    fetching,
    hourOverride,
    isInternetReachable,
    lastGoodData?.currentMarathonHour,
    lastGoodData?.latestMarathon,
    refresh,
    vpHeight,
    vpWidth,
  ]);

  return (
    <>
      <Modal
        isOpen={showSecretMenu}
        onClose={() => setShowSecretMenu(false)}
        avoidKeyboard
        background={"#fff6"}
      >
        <Text>Override</Text>
        <TextInput
          style={{
            height: 40,
            borderColor: "black",
            borderWidth: 1,
            width: 80,
            backgroundColor: "white",
          }}
          value={secretMenuText || ""}
          onChangeText={setSecretMenuText}
        />
        <Button
          onPress={() => {
            const parsedText = Number.parseInt(secretMenuText, 10);
            if (
              (!Number.isNaN(parsedText) && parsedText === -1) ||
              (parsedText >= 0 &&
                data?.latestMarathon &&
                parsedText <= data.latestMarathon.hours.length)
            ) {
              setHourOverride(parsedText);
            } else {
              setHourOverride(undefined);
            }
            setShowSecretMenu(false);
          }}
        >
          Confirm
        </Button>
      </Modal>
      {component}
    </>
  );
};
