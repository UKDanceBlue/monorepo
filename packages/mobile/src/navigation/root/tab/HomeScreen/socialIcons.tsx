import { universalCatch } from "@common/logging";
import { FontAwesome5 } from "@expo/vector-icons";
import { Pressable } from "@gluestack-ui/themed-native-base";
import { openURL } from "expo-linking";
import { PixelRatio } from "react-native";

export interface SocialIcon {
  name: string;
  url: string;
  icon: string;
}

export const socialIcons: SocialIcon[] = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/danceblue/",
    icon: "facebook",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/uk_danceblue/",
    icon: "instagram",
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@uk_danceblue",
    icon: "tiktok",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/channel/UCcF8V41xkzYkZ0B1IOXntjg?sub_confirmation=1",
    icon: "youtube",
  },
  {
    name: "Website",
    url: "https://danceblue.org",
    icon: "globe",
  },
];

export function SocialIconView({
  url,
  icon,
  color,
}: SocialIcon & {
  color: string;
}): JSX.Element | null {
  if (!url) {
    return null;
  }

  return (
    <Pressable
      onPress={() => {
        openURL(url).catch(universalCatch);
      }}
      _pressed={{ opacity: 0.6 }}
    >
      <FontAwesome5
        name={icon}
        style={{
          textAlignVertical: "center",
          fontSize: PixelRatio.get() * 8,
        }}
        color={color}
      />
    </Pressable>
  );
}
