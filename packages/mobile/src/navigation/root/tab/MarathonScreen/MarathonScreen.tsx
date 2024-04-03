import { useNetworkStatus } from "@common/customHooks";
import { Logger } from "@common/logger/Logger";
import { dateTimeFromSomething } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/dist/graphql-client-public";
import { Button, Modal, Text } from "native-base";
import { useEffect, useState } from "react";
import { TextInput } from "react-native";
import { useQuery } from "urql";

import { HourScreenComponent } from "./HourScreenComponent";
import { MarathonCountdownScreen } from "./MarathonCountdownScreen";

const marathonScreenDocument = graphql(/* GraphQL */ `
  query MarathonScreen {
    currentMarathonHour {
      ...HourScreenFragment
    }
    nextMarathon {
      startDate
      endDate
      hours {
        ...HourScreenFragment
      }
    }
  }
`);

export const MarathonScreen = () => {
  const [{ isInternetReachable }] = useNetworkStatus();

  const [{ fetching, data, error }, refresh] = useQuery({
    query: marathonScreenDocument,
  });

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
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [isInternetReachable, refresh]);

  let component = null;

  if (isInternetReachable === false) {
    component = (
      <Text width="full" height="full" textAlign="center">
        No Internet Connection, cannot load marathon information
      </Text>
    );
  } else if (error) {
    Logger.error("A graphql error occurred", {
      error,
      source: "MarathonScreen",
    });
    component = (
      <Text width="full" height="full" textAlign="center">
        Something went Wrong!
      </Text>
    );
  } else if (data?.nextMarathon && hourOverride != null) {
    if (hourOverride < 0) {
      component = (
        <MarathonCountdownScreen
          marathonStart={dateTimeFromSomething(data.nextMarathon.startDate)}
          marathonEnd={dateTimeFromSomething(data.nextMarathon.endDate)}
          showSecretMenu={() => setShowSecretMenu(true)}
        />
      );
    } else {
      component = (
        <HourScreenComponent
          hourScreenFragment={data.nextMarathon.hours[hourOverride]}
          isLoading={fetching && !data.nextMarathon}
          refresh={() => refresh({ requestPolicy: "network-only" })}
          showSecretMenu={() => setShowSecretMenu(true)}
        />
      );
    }
  } else if (data?.currentMarathonHour) {
    component = (
      <HourScreenComponent
        hourScreenFragment={data.currentMarathonHour}
        isLoading={fetching && !data.currentMarathonHour}
        refresh={() => refresh({ requestPolicy: "network-only" })}
        showSecretMenu={() => setShowSecretMenu(true)}
      />
    );
  } else if (data?.nextMarathon) {
    component = (
      <MarathonCountdownScreen
        marathonStart={dateTimeFromSomething(data.nextMarathon.startDate)}
        marathonEnd={dateTimeFromSomething(data.nextMarathon.endDate)}
        showSecretMenu={() => setShowSecretMenu(true)}
      />
    );
  } else {
    component = <Text> {JSON.stringify(data)}</Text>;
  }

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
                data?.nextMarathon &&
                parsedText <= data.nextMarathon.hours.length)
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
