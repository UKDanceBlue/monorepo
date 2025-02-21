import { FontAwesome5 } from "@expo/vector-icons";
import { dateTimeFromSomething } from "@ukdanceblue/common";
import { DateTime } from "luxon";
import { Center, Flex, HStack, ScrollView, Text, View } from "native-base";
import { useWindowDimensions } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

import Breadcrumbs from "@/common/components/Breadcrumbs";
import { useThemeColors, useThemeFonts } from "@/common/customHooks";
import type { FragmentOf } from "@/graphql/index";
import { graphql, readFragment } from "@/graphql/index";

import DanceBlueRibbon from "../../../../../common/components/svgs/DBRibbon";
import ScoreboardItem from "../ScoreBoardScreen/ScoreboardItem";
import { MyTeamFragment } from "../TeamScreen/TeamScreen";

export const MyFundraisingFragment = graphql(/* GraphQL */ `
  fragment MyFundraisingFragment on PersonNode {
    fundraisingTotalAmount
    fundraisingAssignments {
      amount
      entry {
        donatedToText
        donatedByText
        donatedOn
      }
    }
  }
`);

const FundraisingScreen = ({
  myTeamFragment,
  myFundraisingFragment,
  loading: loading,
  refresh: refresh,
}: {
  myTeamFragment: FragmentOf<typeof MyTeamFragment> | null;
  myFundraisingFragment: FragmentOf<typeof MyFundraisingFragment> | null;
  loading: boolean;
  refresh: () => void;
}) => {
  const team = readFragment(MyTeamFragment, myTeamFragment);
  const fundraising = readFragment(
    MyFundraisingFragment,
    myFundraisingFragment
  );
  const { secondary } = useThemeColors();

  const { body, mono } = useThemeFonts();
  const { width: screenWidth, fontScale } = useWindowDimensions();

  if (team == null) {
    return (
      <Center>
        <FontAwesome5
          name="users"
          size={screenWidth / 3}
          color={"#cc1100"}
          style={{ textAlignVertical: "center" }}
        />
        <Text fontSize={25} mx="8" m="4" textAlign="center">
          You are not on a team.
        </Text>
        <Text mx="8" m="4" textAlign="center">
          If you believe this is an error and have submitted spirit points, try
          logging out and logging back in. If that doesn&apos;t work, don&apos;t
          worry, your spirit points are being recorded, please contact your team
          captain or the DanceBlue committee to get access in the app.
        </Text>
      </Center>
    );
  } else {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={refresh} refreshing={loading} />
        }
        flex={1}
      >
        <Breadcrumbs
          pageName="Fundraising"
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
              Your Fundraising
            </Text>
          </HStack>
          <View display="flex" alignItems="center" marginBottom={5}>
            <Text color="primary.600" flexDirection="row">
              <Text font={body} fontSize="lg" bold>
                Name:{" "}
              </Text>
              <Text fontFamily={mono} fontSize="lg">
                {team.name}
              </Text>
            </Text>
          </View>
          <HStack
            alignItems="center"
            justifyContent="space-evenly"
            backgroundColor="primary.600"
            paddingY="3"
            borderColor="secondary.400"
            borderWidth={6}
            borderRadius={10}
            marginX={3}
          >
            <FontAwesome5
              name="donate"
              size={60 * fontScale}
              color={secondary[400]}
              style={{ textAlignVertical: "center" }}
            />
            <View width={screenWidth / 3}>
              <Flex direction="column">
                <Text
                  fontFamily="headingBold"
                  fontSize="3xl"
                  color="secondary.400"
                  textAlign="center"
                  paddingTop={2}
                  noOfLines={1}
                >
                  ${(fundraising?.fundraisingTotalAmount ?? 0).toFixed(2)}
                </Text>
              </Flex>
            </View>
          </HStack>
        </View>
        <View borderColor="primary.600" flex={1} marginTop={6}>
          {fundraising && fundraising.fundraisingAssignments.length > 0 ? (
            <View>
              {fundraising.fundraisingAssignments.map((assignment, index) => (
                <View
                  key={index}
                  borderBottomWidth={1}
                  borderBottomColor="primary.600"
                  padding={3}
                >
                  <ScoreboardItem
                    name={`${assignment.entry.donatedByText}\n${dateTimeFromSomething(assignment.entry.donatedOn)?.toLocaleString(DateTime.DATE_SHORT)}`}
                    amount={assignment.amount}
                    rank={undefined}
                    amountPrefix="$"
                    amountDecimalPlaces={2}
                  />
                </View>
              ))}
            </View>
          ) : (
            <Center>
              <Text>
                Your team captain has not assigned any donations to you.
              </Text>
            </Center>
          )}
        </View>
      </ScrollView>
    );
  }
};

export default FundraisingScreen;
