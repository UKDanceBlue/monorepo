import * as WebBrowser from "expo-web-browser";
import { Image, Text, View } from "native-base";
import { PixelRatio, StyleSheet, TouchableHighlight } from "react-native";

// This is good, but we need to hold off until we get transparent logos for each sponsor
// Probably a good idea to wait until the new home screen
const SponsorCard = ({
  sponsorLink,
  name,
}: {
  imagePath: string;
  sponsorLink?: string;
  name: string;
}) => {
  return (
    <TouchableHighlight
      onPress={
        sponsorLink ? () => WebBrowser.openBrowserAsync(sponsorLink) : undefined
      }
      underlayColor="transparent"
    >
      <View backgroundColor="primary.100" style={styles.item}>
        <Image
          borderRadius={"8"}
          source={{
            // uri: url ?? undefined,
            width: PixelRatio.getPixelSizeForLayoutSize(75),
            height: PixelRatio.getPixelSizeForLayoutSize(50),
          }}
          alt={name}
          resizeMode="contain"
        />
        <Text
          fontFamily="mono"
          fontSize="md"
          color="primary.600"
          textAlign="center"
          style={styles.text}
        >
          Click to learn more
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  // container: { flex: 1 },
  // img: { borderRadius: 8 },
  item: {
    alignItems: "center",
    alignSelf: "stretch",
    borderRadius: 8,
    elevation: 3,
    justifyContent: "center",
    margin: 10,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  text: {
    alignSelf: "center",
    marginVertical: 8,
  },
});

export default SponsorCard;
