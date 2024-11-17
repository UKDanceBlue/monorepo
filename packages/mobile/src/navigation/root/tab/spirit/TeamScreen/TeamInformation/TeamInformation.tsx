import { FontAwesome5 } from "@expo/vector-icons";
import { openBrowserAsync } from "expo-web-browser";
import { Flex, HStack, Text, View } from "native-base";
import { useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import Breadcrumbs from "@/common/components/Breadcrumbs";
import { useThemeFonts } from "@/common/customHooks";
import { universalCatch } from "@/common/logging";

import CommitteeHoldingSign from "../../../../../../../assets/svgs/CommitteeHoldingSign";
import DanceBlueRibbon from "../../../../../../../assets/svgs/DBRibbon";
import type { StandingType } from "../../../../../../types/StandingType";
import Scoreboard from "../../ScoreBoardScreen/Scoreboard";

const TeamInformation = ({
  name,
  captains,
  scoreboardData,
  teamTotal,
}: {
  name: string;
  captains: readonly string[];
  members: readonly string[];
  scoreboardData: readonly StandingType[];
  teamTotal: number;
  teamFundraisingTotal: number;
  myFundraisingEntries: readonly {
    amount: number;
    entry: {
      donatedToText?: string | undefined | null;
      donatedByText?: string | undefined | null;
      donatedOn: string | Date;
    };
  }[];
}) => {
  const { body, mono } = useThemeFonts();
  const { width: screenWidth } = useWindowDimensions();

  const captainString = captains.join(", ");

  return (
    <View overflow="scroll" flex={1}>
      <Breadcrumbs
        pageName={name}
        includeBreadcrumbs={false}
        previousPage={"Teams"}
      />
      <View>
        <HStack alignItems="center" justifyContent="center">
          <DanceBlueRibbon svgProps={{ width: 50, height: 50 }} />
          <Text
            fontFamily="headingBold"
            color="primary.600"
            fontSize="2xl"
            paddingRight={3}
          >
            Team Info
          </Text>
        </HStack>
        <View display="flex" alignItems="center" marginBottom={5}>
          <Text color="primary.600" flexDirection="row">
            <Text font={body} fontSize="lg" bold>
              Name:{" "}
            </Text>
            <Text fontFamily={mono} fontSize="lg">
              {name}
            </Text>
          </Text>
          {captains.length > 0 && (
            <Text color="primary.600" flexDirection="row">
              <Text font={body} fontSize="lg" bold>{`Captain${
                captains.length > 1 ? "s" : ""
              }: `}</Text>
              <Text fontFamily={mono} fontSize="lg">
                {captainString}
              </Text>
            </Text>
          )}
        </View>
        <HStack alignItems="center">
          <CommitteeHoldingSign
            svgProps={{ width: screenWidth / 2, height: 200 }}
          />
          <View width={screenWidth / 3}>
            <Flex direction="column">
              <Text
                fontFamily="headingBold"
                fontSize="5xl"
                color="secondary.400"
                textAlign="center"
                paddingTop={2}
              >
                {teamTotal}
              </Text>
              <Text
                fontFamily="mono"
                fontSize="3xl"
                color="primary.600"
                textAlign="center"
              >
                Spirit Points
              </Text>
            </Flex>
          </View>
        </HStack>
      </View>
      <View borderColor="primary.600" flex={1}>
        <Scoreboard
          title="Team Standings"
          data={scoreboardData}
          titleButton={
            <TouchableOpacity
              onPress={() => {
                openBrowserAsync("https://spiritpoints.danceblue.org").catch(
                  universalCatch
                );
              }}
              style={{ marginLeft: 20 }}
            >
              <FontAwesome5
                name="plus-circle"
                size={25}
                color={"#0032A0"}
                style={{ textAlignVertical: "center", paddingRight: 0 }}
              />
            </TouchableOpacity>
          }
        />
      </View>
    </View>
  );
};

export default TeamInformation;
