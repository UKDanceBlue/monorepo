import { Image } from "expo-image";
import { type ReactNode, useState } from "react";
import WebView from "react-native-webview";

import { FontAwesome } from "~/lib/icons/FontAwesome";
import { FontAwesome5 } from "~/lib/icons/FontAwesome5";

import { AudioPlayer } from "../controls/AudioPlayer";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Text } from "../ui/text";
import { YoutubeEmbedWebView } from "./YoutubeEmbedWebView";

export interface FeedItemType {
  title: string;
  icon: ReactNode;
}

const feedItemTypes = {
  blog: {
    title: "Blog",
    icon: <FontAwesome name="feed" size={24} color="black" />,
  },
  podcast: {
    title: "Podcast",
    icon: <FontAwesome5 name="podcast" size={24} color="black" />,
  },
  youtube: {
    title: "YouTube",
    icon: <FontAwesome5 name="youtube" size={24} color="black" />,
  },
  instagram: {
    title: "Instagram",
    icon: <FontAwesome5 name="instagram" size={24} color="black" />,
  },
  post: {
    title: "Post",
    icon: <FontAwesome5 name="list" size={24} color="black" />,
  },
} as const satisfies Record<string, FeedItemType>;

export interface FeedItemButton {
  title: string;
  onPress: () => void;
}

export interface FeedItemData {
  title: string;
  type: keyof typeof feedItemTypes;
  date: Date;
  imageUrl?: string;
  youtubeUrl?: string;
  audioUrl?: string;
  textContent?: string;
  buttons: FeedItemButton[];
}

export function FeedItem({
  data: {
    title,
    type,
    date,
    imageUrl,
    youtubeUrl,
    audioUrl,
    textContent,
    buttons,
  },
}: {
  data: FeedItemData;
}) {
  const [hidden, setHidden] = useState(false);

  const cardContent: ReactNode[] = [
    <CardDescription key="date">{date.toLocaleDateString()}</CardDescription>,
  ];
  if (imageUrl) {
    cardContent.push(
      <Image key="image" source={{ uri: imageUrl }} style={{ width: "100%" }} />
    );
  }
  if (youtubeUrl) {
    cardContent.push(
      <YoutubeEmbedWebView
        // style={{ height: calculatedHeight }}
        source={{ uri: youtubeUrl }}
        allowsFullscreenVideo={true}
        onErrorEmitted={() => setHidden(true)}
      />
    );
  }
  if (audioUrl) {
    cardContent.push(<AudioPlayer key="audio" url={audioUrl} />);
  }
  if (textContent) {
    cardContent.push(
      <CardDescription key="text">
        <Text>{textContent}</Text>
      </CardDescription>
    );
  }

  if (hidden) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        {feedItemTypes[type].icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{cardContent}</CardContent>
      <CardFooter>
        {buttons.map((button) => (
          <Button key={button.title} onPress={button.onPress}>
            {button.title}
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}
