import * as WebBrowser from "expo-web-browser";
import { Box, Image } from "native-base";
import { PixelRatio, TouchableHighlight } from "react-native";

/**
 * A card showing a Sponsor's logo that link's to their website
 */
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
      underlayColor="#dddddd"
      style={{ flex: 1 }}
    >
      <Box
        shadow="6"
        flex={1}
        backgroundColor="white"
        p="1"
        m="2"
        borderRadius={6}
        justifyContent="center"
      >
        <Image
          source={{
            uri: undefined,
            width: PixelRatio.getPixelSizeForLayoutSize(75),
            height: PixelRatio.getPixelSizeForLayoutSize(50),
          }}
          alt={name}
          flex={1}
          style={{ resizeMode: "contain" }}
        />
      </Box>
    </TouchableHighlight>
  );
};

export default SponsorCard;
