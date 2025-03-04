import { DateTime } from "luxon";
import { useEffect, useState } from "react";

import { useExploreFeedData } from "~/api/hooks/useExploreFeedData";
import type { FeedItemData } from "~/components/feed/FeedItem";

import { Logger, universalCatch } from "../logger/Logger";
import { parseBlogText } from "./parseBlogText";

export function useFeed(): {
  feed: FeedItemData[];
  loading: boolean;
  refresh: () => void;
} {
  const {
    blogPosts,
    podcasts,
    youtubeVideos,
    parsedServerFeed,
    loading,
    refresh,
  } = useExploreFeedData();

  const [feed, setFeed] = useState<FeedItemData[]>([]);

  useEffect(() => {
    let shouldSet = true;
    async function load() {
      const feed: FeedItemData[] = [];
      if (!loading) {
        for (const blogPost of blogPosts ?? []) {
          const link = blogPost.id
            .replace("new.danceblue.org", "danceblue.org")
            .replace("preview.danceblue.org", "danceblue.org");
          const published = DateTime.fromRFC2822(blogPost.published);

          // eslint-disable-next-line no-await-in-loop
          const textContent = await parseBlogText(blogPost.content, 500);
          feed.push({
            key: blogPost.id,
            type: "blog",
            title: blogPost.title,
            date: published,
            buttons: textContent.endsWith("[...]")
              ? [
                  {
                    title: "Read More",
                    url: link,
                  },
                ]
              : [],
            textContent,
          });
        }
        for (const podcast of podcasts ?? []) {
          const link = podcast.id
            .replace("new.danceblue.org", "danceblue.org")
            .replace("preview.danceblue.org", "danceblue.org");
          const published = DateTime.fromRFC2822(podcast.published);

          const podcastUrl = podcast.enclosures.find(
            (enclosure) => enclosure.mimeType === "audio/mpeg"
          )?.url;

          // eslint-disable-next-line no-await-in-loop
          const textContent = await parseBlogText(podcast.content, 250);
          feed.push({
            key: podcast.id,
            type: "podcast",
            title: podcast.title,
            date: published,
            audioUrl: podcastUrl,
            buttons: textContent.endsWith("[...]")
              ? [
                  {
                    title: "Read More",
                    url: link,
                  },
                ]
              : [],
            textContent,
          });
        }
        for (const youtubeVideo of youtubeVideos ?? []) {
          const published = DateTime.fromISO(youtubeVideo.published);

          feed.push({
            key: youtubeVideo.id,
            type: "youtube",
            title: youtubeVideo.title,
            date: published,
            youtubeUrl: youtubeVideo.links[0].url,
            buttons: [],
          });
        }
        for (const serverFeedItem of parsedServerFeed) {
          const published = serverFeedItem.sortByDate;

          feed.push({
            key: serverFeedItem.uuid,
            type: serverFeedItem.link?.startsWith("https://www.instagram.com/p")
              ? "instagram"
              : "post",
            title: serverFeedItem.title,
            date: published,
            imageUrl: serverFeedItem.image?.url,
            textContent: serverFeedItem.textContent,
            buttons: serverFeedItem.link
              ? [
                  {
                    title: "See the whole post",
                    url: serverFeedItem.link,
                  },
                ]
              : [],
          });
        }
      }
      return feed;
    }

    load()
      .then((feed) => {
        if (shouldSet) {
          setFeed(
            [...feed].sort((a, b) => b.date.toMillis() - a.date.toMillis())
          );
        }
      })
      .catch(universalCatch);

    return () => {
      shouldSet = false;
    };
  }, [blogPosts, loading, parsedServerFeed, podcasts, youtubeVideos]);

  return {
    feed,
    loading,
    refresh: () => {
      refresh().catch((error: unknown) =>
        Logger.error("Error refreshing explorer feed", {
          error,
          source: "useCombinedFeed",
        })
      );
    },
  };
}
