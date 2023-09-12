// Import third-party dependencies
import { Audio } from "expo-av";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { parse } from "react-native-rss-parser";

import { useNetworkStatus } from "../../customHooks";
import { universalCatch } from "../../logging";
import { showMessage } from "../../util/alertUtils";
import AudioPlayer from "../AudioPlayer";

/**
 * A row-based component showing a target name, their rank (if applicable), and their points
 */
const PodcastPlayer = () => {
  const [ { isConnected }, isNetStatusLoaded ] = useNetworkStatus();

  const [ podcastAudio, setPodcastAudio ] = useState<Audio.Sound | undefined>();
  const [ podcastTitle, setPodcastTitle ] = useState<string | undefined>(undefined);
  const [ podcastTitleLink, setPodcastTitleLink ] = useState<string | undefined>(undefined);

  const loadPodcastUrl = async () => {
    try {
      const feed = await fetch("https://www.danceblue.org/feed");
      const xml = await feed.text();
      const parsedFeed = await parse(xml);
      const podcastPosts = parsedFeed.items.filter((item) => item.categories.some((category) => category?.name === "Podcast")).filter((item) => item.enclosures.some((enclosure) => enclosure.mimeType === "audio/mpeg"));
      const mostRecentPodcasts = podcastPosts
        .map((item) => ({ ...item, dateTimePublished: DateTime.fromRFC2822(item.published) }))
        .sort((a, b) => a.dateTimePublished > b.dateTimePublished ? -1 : a.dateTimePublished > b.dateTimePublished ? 1 : 0);
      const mostRecentPodcast = mostRecentPodcasts.length > 0 ? mostRecentPodcasts[0] : undefined;

      if (mostRecentPodcast != null) {
        const podcastUrl = mostRecentPodcast.enclosures.find((enclosure) => enclosure.mimeType === "audio/mpeg")?.url;
        if (podcastUrl != null) {
          const sound = new Audio.Sound();
          await sound.loadAsync({ uri: podcastUrl });
          setPodcastAudio(sound);
          setPodcastTitle(mostRecentPodcast.title);
          setPodcastTitleLink(mostRecentPodcast.links.find((link) => (link as { url: unknown }).url !== null && link.url !== "")?.url);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isNetStatusLoaded && isConnected && podcastAudio == null) {
      Audio.setAudioModeAsync({ staysActiveInBackground: true, playsInSilentModeIOS: true }).catch(showMessage);
      loadPodcastUrl().catch(showMessage);
    }

    return () => {
      if (podcastAudio) {
        podcastAudio.unloadAsync().catch(showMessage);
      }
      Audio.setAudioModeAsync({ staysActiveInBackground: false }).catch(universalCatch);
    };
  }, [
    isConnected, isNetStatusLoaded, podcastAudio
  ]);

  return (
    <AudioPlayer
      sound={ podcastAudio }
      loading={ !podcastAudio }
      title={`Podcast - ${podcastTitle ?? ""}`}
      titleLink={podcastTitleLink}
    />
  );
};

export default PodcastPlayer;
