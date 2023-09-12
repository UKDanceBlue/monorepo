import { Entypo } from "@expo/vector-icons";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Heading, Row, ScrollView, Spinner, Text, VStack } from "native-base";
import { useCallback, useEffect, useRef, useState } from "react";
import { NativeSyntheticEvent, TextInput, TextInputSubmitEditingEventData } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Standings from "../../../../common/components/Standings";
import { universalCatch } from "../../../../common/logging";
import { useFirebase, useUserData } from "../../../../context";
import { StandingType } from "../../../../types/StandingType";

import { useFirestoreMoralePoints } from "./FirestoreMoralePoints";

const textInputStyle: React.ComponentProps<typeof TextInput>["style"] = {
  width: "100%",
  backgroundColor: "#f0f0f0",
  borderRadius: 5,
  padding: 10,
};

export const MoraleCup = () => {
  const { fbFirestore } = useFirebase();
  const {
    teamNames, teamPoints, errorMessage, loading: loadingMoralePoints
  } = useFirestoreMoralePoints();

  const [ otherErrorMessage, setOtherErrorMessage ] = useState<string | null>(null);

  // You can hit the left then right trophies and the header in the middle to reset your selected morale team ID
  const secretTaps = useRef(0);

  const [ moraleTeamId, setMoraleTeamId ] = useState<string | null>(null);
  const [ hasLoadedMoraleTeamId, setHasLoadedMoraleTeamId ] = useState(false);
  const {
    removeItem: clearMoraleTeamId,
    getItem: retrieveMoraleTeamId,
    setItem: storeMoraleTeamId,
  } = useAsyncStorage("morale-team-id-2023");

  const { attributes } = useUserData();

  const isMoraleLeader = attributes.committee === "morale-committee" && attributes.committeeRank === "committee-member";

  useEffect(() => {
    retrieveMoraleTeamId().then((moraleTeamIdToSet) => {
      if (moraleTeamIdToSet != null && moraleTeamIdToSet !== moraleTeamId) {
        setMoraleTeamId(moraleTeamIdToSet);
      } else if (moraleTeamIdToSet == null && moraleTeamId != null) {
        setMoraleTeamId(null);
      }
    }).catch((error) => {
      if (error instanceof Error) {
        setOtherErrorMessage(error.message);
      } else {
        setOtherErrorMessage("Unknown error");
      }
    })
      .finally(() => {
        setHasLoadedMoraleTeamId(true);
      });
  });

  const handleSetTeamId = useCallback((teamId: string) => {
    const numericTeamId = parseInt(teamId, 10);
    if (isNaN(numericTeamId)) {
      alert("Invalid team ID");
    } else if (numericTeamId < 1 || numericTeamId > 24) {
      alert("Invalid team ID");
    } else {
      setMoraleTeamId(teamId);
      storeMoraleTeamId(teamId).catch((error) => {
        if (error instanceof Error) {
          setOtherErrorMessage(error.message);
        } else {
          setOtherErrorMessage("Unknown error");
        }
      });
    }
  }, [storeMoraleTeamId]);

  // similar to how ../MarathonScreen does it
  if (errorMessage != null || otherErrorMessage != null) {
    return (
      <Text variant="error-message">{errorMessage ?? otherErrorMessage}</Text>
    );
  }

  let moralePointComponent = null;
  if (teamPoints != null && teamNames != null) {
    const data: StandingType[] = Object.keys(teamPoints).map((teamNumber) => {
      const teamName = teamNames[teamNumber];
      const teamPoint = teamPoints[teamNumber];
      return {
        id: teamNumber,
        name: `Team ${teamNumber}: ${teamName}`,
        points: teamPoint,
        highlighted: teamNumber === moraleTeamId
      };
    });

    if (data.length === 0) {
      moralePointComponent = (
        <Text variant="error-message">No morale point data</Text>
      );
    } else {
      moralePointComponent = (
        <Standings
          standingData={
            data
          }
          titleText="Morale Cup Standings"
          startExpanded
        />
      );
    }
  } else if (loadingMoralePoints) {
    moralePointComponent = (
      <Spinner width="100%" size="lg" />
    );
  } else {
    moralePointComponent = (
      <Text variant="error-message">No morale point data</Text>
    );
  }

  let moraleTeamInfoComponent = null;

  if (moraleTeamId != null && teamNames != null) {
    if (isMoraleLeader) {
      moraleTeamInfoComponent = (
        <>
          <Text>
          Enter your morale team&apos;s name:
          </Text>
          <TextInput
            style={textInputStyle}
            defaultValue={teamNames[moraleTeamId]}
            returnKeyType ="done"
            placeholder="Enter a new team name and press enter"
            maxLength={60}
            onSubmitEditing={(event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
              fbFirestore.doc("marathon/2023/morale/teams").update({ [moraleTeamId]: event.nativeEvent.text })
                .catch((error) => {
                  if (error instanceof Error) {
                    alert(error.message);
                  } else {
                    alert("Unknown error");
                  }
                });
            }} />
          <Text fontSize="xs">
            I shouldn&apos;t need to say this, but your changes here will be broadcast to everyone with the app, be responsible.
          </Text>
        </>
      );
    } else {
      moraleTeamInfoComponent = (
        <Text>{teamNames[moraleTeamId]}</Text>
      );
    }
  } else if (hasLoadedMoraleTeamId) {
    moraleTeamInfoComponent = (
      <TextInput
        style={textInputStyle}
        returnKeyType ="done"
        keyboardType="numeric"
        maxLength={2}
        onSubmitEditing={(event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
          handleSetTeamId(event.nativeEvent.text);
        }}
        placeholder="Dancers: Enter your team number"/>
    );
  } else {
    moraleTeamInfoComponent = (
      <Text>Loading...</Text>
    );
  }

  const headingComponent = (
    <VStack
      flex={0}
      alignItems="center"
      flexDirection="column"
      paddingX="4">
      <Row alignItems="center" justifyContent="space-evenly" width="100%">
        <Entypo
          name="trophy"
          size={40}
          color="gold"
          onPress={() => {
            if (secretTaps.current === 0) {
              secretTaps.current = 1;
              setTimeout(() => {
                secretTaps.current = 0;
              }, 1000);
            } else {
              secretTaps.current = 0;
            }
          }}
          suppressHighlighting
        />
        <Heading
          color="primary.600"
          fontSize="6xl"
          fontFamily="bodoni-flf-roman"
          suppressHighlighting
          onPress={() => {
            if (secretTaps.current === 2) {
              clearMoraleTeamId().catch(universalCatch);
              setMoraleTeamId(null);
            } else {
              secretTaps.current = 0;
            }
          }}
        >Morale Cup</Heading>
        <Entypo
          name="trophy"
          size={40}
          color="gold"
          onPress={() => {
            if (secretTaps.current === 1) {
              secretTaps.current = 2;
            } else {
              secretTaps.current = 0;
            }
          }}
          suppressHighlighting
        />
      </Row>
      {moraleTeamInfoComponent}
    </VStack>
  );


  return (
    <VStack flex={1} alignItems="center" flexDirection="column">
      {headingComponent}
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {moralePointComponent}
        </ScrollView>
      </SafeAreaView>
    </VStack>
  );
};
