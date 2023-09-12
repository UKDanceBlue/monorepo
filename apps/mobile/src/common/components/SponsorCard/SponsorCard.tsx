import * as WebBrowser from "expo-web-browser";
import { Image, Text, View } from "native-base";
import { PixelRatio, StyleSheet, TouchableHighlight } from "react-native";

import { useFirebaseStorageUrl } from "../../customHooks";

// This is good, but we need to hold off until we get transparent logos for each sponsor
// Probably a good idea to wait until the new home screen
const SponsorCard = ({
  imagePath,
  sponsorLink,
  name,
}: {
  imagePath: string;
  sponsorLink?: string;
  name: string;
}) => {
  const [url] = useFirebaseStorageUrl(`gs://react-danceblue.appspot.com${imagePath}`);

  return (
    <TouchableHighlight
      onPress={sponsorLink ? () => WebBrowser.openBrowserAsync(sponsorLink) : undefined}
      underlayColor="transparent"
    >
      <View backgroundColor="primary.100" style={styles.item}>
        <Image
          borderRadius={"8"}
          source={{ uri: url ?? undefined, width: PixelRatio.getPixelSizeForLayoutSize(75), height: PixelRatio.getPixelSizeForLayoutSize(50) }}
          alt={name}
          resizeMode="contain"
        />
        <Text
          fontFamily="mono"
          fontSize="md"
          color="primary.600"
          textAlign="center"
          style={styles.text}>Click to learn more</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    margin: 10,
    elevation: 3,
  },
  img: { borderRadius: 8 },
  text: {
    marginVertical: 8,
    alignSelf: "center",
  },
});

export default SponsorCard;
