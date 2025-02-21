import { Container, Flex, Text, View } from "native-base";
import { memo, useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { useThemeColors } from "@/common/customHooks";

import DanceBlueRibbon from "../../../../../../common/components/svgs/DBRibbon";
import FirstPlaceMedal from "./1stPlace";
import SecondPlaceMedal from "./2ndPlace";
import ThirdPlaceMedal from "./3rdPlace";

function Award({ rank, size }: { rank: number; size: number }) {
  const colors = useThemeColors();

  switch (rank) {
    case 1: {
      return (
        <FirstPlaceMedal
          width={size}
          height={size}
          color={colors.secondary[400]}
        />
      );
    }
    case 2: {
      return (
        <SecondPlaceMedal
          width={size}
          height={size}
          color={colors.primary[400]}
        />
      );
    }
    case 3: {
      return (
        <ThirdPlaceMedal
          width={size}
          height={size}
          color={colors.tertiary[400]}
        />
      );
    }
    default: {
      return (
        <Text color="primary.600" fontSize="3xl" bold>
          {rank}
        </Text>
      );
    }
  }
}

const ScoreboardItem = ({
  rank,
  showPoints,
  name,
  amount,
  amountPrefix = "",
  amountDecimalPlaces = 0,
  highlighted = false,
}: {
  showPoints?: boolean;
  rank?: number;
  name: string;
  amount: number;
  amountPrefix?: string;
  amountDecimalPlaces?: number;
  highlighted?: boolean;
}) => {
  const { width: screenWidth } = useWindowDimensions();

  const icon = useMemo(
    () => rank != null && <Award rank={rank} size={screenWidth * 0.1} />,
    [rank, screenWidth]
  );

  return (
    <View
      height={screenWidth * 0.15}
      backgroundColor={highlighted ? "primary.50" : undefined}
    >
      <Flex direction="row" alignItems="center" flex={1}>
        {icon && (
          <Container
            justifyContent="center"
            alignItems="center"
            flex={1.5}
            ml="2"
          >
            {icon}
          </Container>
        )}
        <Container justifyContent="flex-start" flex={8}>
          <Flex direction="row">
            <Container justifyContent="center" alignItems="flex-start" flex={0}>
              <DanceBlueRibbon
                svgProps={{
                  width: screenWidth * 0.1,
                  height: screenWidth * 0.1,
                }}
              />
            </Container>
            <Container
              justifyContent="center"
              marginLeft={1}
              alignItems="stretch"
            >
              <Text color="primary.600" fontSize="lg" bold>
                {name}
              </Text>
            </Container>
          </Flex>
        </Container>
        <Container
          justifyContent="flex-end"
          flexDirection="row"
          flex={2}
          paddingRight={4}
        >
          <Text color="primary.600" fontSize="lg" fontFamily="mono">
            {amountPrefix}
            {amount.toFixed(amountDecimalPlaces)}
          </Text>
          <Text color="primary.600" fontSize="lg" fontFamily="mono">
            {showPoints && " points"}
          </Text>
        </Container>
      </Flex>
    </View>
  );
};
export default memo(ScoreboardItem);
