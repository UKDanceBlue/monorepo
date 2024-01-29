import { DateTime } from "luxon";
import { Text } from "native-base";
import { useEffect, useState } from "react";
import type { FeedItem } from "react-native-rss-parser";

import { ExplorerItem } from "./ExplorerItem";
import { useExplorerFeed } from "./useExplorerFeed";

export interface FeedSortingItem {
  jsxElement: JSX.Element,
  published: DateTime,
}

export function useCombinedFeed(): {
  feed: FeedSortingItem[];
} {
  const [feed, setFeed] = useState<FeedSortingItem[]>([]);

  const {
    blogPosts,
    podcasts,
    youtubes,
    loading,
  } = useExplorerFeed();

  useEffect(() => {if (!loading) {

    setFeed([]);

    /* BLOG POSTS */
    blogPosts?.forEach((post: FeedItem) => {
      const published = DateTime.fromRFC2822(post.published);

      const jsxElement = (
        <>
          <ExplorerItem isText={true} resourceLink={post.id.replace('new.danceblue.org', 'danceblue.org').replace('preview.danceblue.org', 'danceblue.org')} blogTitle={post.title} blogContent={post.content.substring(0, 350).concat(" [...]")}/>
          <Text paddingRight={3} width="100%" textAlign="right">{published.toLocaleString()}</Text>
        </>
      );

      setFeed((previousFeed) => ([
        ...previousFeed,
        {jsxElement, published}
      ]));
    });

    podcasts?.forEach((podcast: FeedItem) => {
      const podcastUrl = podcast.enclosures.find(
        (enclosure) => enclosure.mimeType === "audio/mpeg"
      )?.url
      const published = DateTime.fromRFC2822(podcast.published);

      const jsxElement = (
        <>
          <ExplorerItem isAudio={true} resourceLink={podcastUrl} blogTitle={podcast.title}/>
          <Text paddingRight={3} width="100%" textAlign="right">{published.toLocaleString()}</Text>
        </>
      );

      setFeed((previousFeed) => ([
        ...previousFeed,
        {jsxElement, published}
      ]));
    });


    youtubes?.forEach((video: FeedItem) => {
      const videoUrl = video.links[0]?.["url"].replace("watch?v=", "embed/");
      const published = DateTime.fromISO(video.published);

      const jsxElement = (
        <>
          <ExplorerItem isYouTube={true} resourceLink={videoUrl}/>
          <Text paddingRight={3} width="100%" textAlign="right">{published.toLocaleString()}</Text>
        </>
      );

      setFeed((previousFeed) => ([
        ...previousFeed,
        {jsxElement, published}
      ]));
    });
  }
  }, [blogPosts, loading, podcasts, youtubes]);

  return {feed};
}
