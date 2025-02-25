import { Image, type ImageSource, useImage } from "expo-image";
import { openURL } from "expo-linking";
import type { DateTime } from "luxon";
import { type ReactNode, useState } from "react";
import { View } from "react-native";

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

export type FeedItemButton = {
  title: string;
} & (
  | {
      onPress: () => void;
    }
  | {
      url: string;
    }
);

export interface FeedItemData {
  key: string;
  title: string;
  type: keyof typeof feedItemTypes;
  date: DateTime;
  imageUrl?: string;
  youtubeUrl?: string;
  audioUrl?: string;
  textContent?: string;
  buttons: FeedItemButton[];
}

function FeedImage({
  source,
  className,
}: {
  source: ImageSource;
  className?: string;
}) {
  const image = useImage(source);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const calculatedHeight = image
    ? (layout.width / image.width) * image.height
    : 0;

  return (
    <View
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({ width, height });
      }}
      className={className}
    >
      <Image
        source={image}
        style={{ width: layout.width, height: calculatedHeight }}
      />
    </View>
  );
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
    <CardDescription key="date">{date.toLocaleString()}</CardDescription>,
  ];
  if (imageUrl) {
    cardContent.push(
      <FeedImage key="image" source={{ uri: imageUrl }} className="flex-1" />
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
        <CardTitle className="flex flex-row gap-2">
          {feedItemTypes[type].icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{cardContent}</CardContent>
      <CardFooter>
        {buttons.map((button) =>
          "url" in button ? (
            <Button
              key={button.title}
              onPress={() => openURL(button.url)}
              href={button.url}
            >
              {button.title}
            </Button>
          ) : (
            <Button key={button.title} onPress={button.onPress}>
              {button.title}
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}
