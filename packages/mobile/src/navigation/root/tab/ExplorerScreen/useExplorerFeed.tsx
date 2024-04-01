import { useNetworkStatus } from "@common/customHooks";
import { universalCatch } from "@common/logging";
import { showMessage } from "@common/util/alertUtils";
import { useCallback, useEffect, useState } from "react";
import type { FeedItem } from "react-native-rss-parser";
import { parse } from "react-native-rss-parser";

// A react hook works kinda like a controller in MVC
export function useExplorerFeed(): {
  blogPosts: FeedItem[] | undefined;
  podcasts: FeedItem[] | undefined;
  youtubeVideos: FeedItem[] | undefined;
  loading: boolean;
  refresh: () => Promise<void>;
} {
  const [{ isInternetReachable }] = useNetworkStatus();
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<FeedItem[] | undefined>();
  const [podcasts, setPodcasts] = useState<FeedItem[] | undefined>();
  // const [instagramPosts, setInstagramPosts] = useState();
  // const [tiktokPosts, setTikTokPosts] = useState();
  const [youtubeVideos, setYoutubeVideos] = useState<FeedItem[] | undefined>();

  // useCallback is a react hook that returns a memoized callback
  // This means that the function will only be recreated if one of the dependencies changes
  const loadFeed = useCallback(async () => {
    if (isInternetReachable === false) {
      showMessage(
        "No internet connection",
        "Please connect to the internet to view the latest content"
      );
      setLoading(false);
    } else if (isInternetReachable === true) {
      setLoading(true);
      try {
        const dbWebsiteRSS = await fetch("https://danceblue.org/feed");
        const dbWebsiteXML = await dbWebsiteRSS.text();
        const dbWebsiteParsed = await parse(dbWebsiteXML);

        const blogPosts = dbWebsiteParsed.items.filter((item) =>
          item.categories.some((category) => category?.name !== "Podcast")
        );

        setBlogPosts(blogPosts);
        // console.log(JSON.stringify(blogPosts, null, 2));

        const podcastPosts = dbWebsiteParsed.items
          .filter((item) =>
            item.categories.some((category) => category?.name === "Podcast")
          )
          .filter((item) =>
            item.enclosures.some(
              (enclosure) => enclosure.mimeType === "audio/mpeg"
            )
          );

        setPodcasts(podcastPosts);
        // console.log(JSON.stringify(podcastPosts, null, 2));

        const youtubeRSS = await fetch(
          "https://www.youtube.com/feeds/videos.xml?channel_id=UCcF8V41xkzYkZ0B1IOXntjg"
        );
        const youtubeXML = await youtubeRSS.text();
        const youtubeParsed = await parse(youtubeXML);
        const youtubePosts = youtubeParsed.items;

        // console.log(JSON.stringify(youtubePosts, null, 2));

        setYoutubeVideos(youtubePosts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }

      // TODO: Implement Instagram and TikTok RSS if possible

      // The empty array at the end of the useCallback hook means that the function will only be recreated if the parent component is recreated
      // If there were any dependencies in the array, the function would be recreated if any of the dependencies changed. i.e. if you had some
      // state value that you wanted to use in the function, you would put it in the array so that the function would be recreated if that state
      // value changed
    }
  }, [isInternetReachable]);

  useEffect(() => {
    loadFeed().catch(universalCatch);

    // useEffect on the other hand is a react hook that runs the function whenever the dependencies change
    // An empty array would mean that the function would only run once, when the component is first created
    // But since we have a dependency, the function will run whenever the dependency changes
  }, [loadFeed, setLoading]);

  return { blogPosts, podcasts, youtubeVideos, loading, refresh: loadFeed };
}

// I would suggest splitting this file into one for each type of feed item instead of having them all in one file
