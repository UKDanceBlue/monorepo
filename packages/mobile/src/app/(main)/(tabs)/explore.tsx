import { AudioPlayer } from "~/components/controls/AudioPlayer";
import { FeedItem } from "~/components/feed/FeedItem";

export default function Explore() {
  return (
    <FeedItem
      data={{
        title: "DanceBlue Behind the Scenes",
        date: new Date(),
        type: "podcast",
        buttons: [],
        audioUrl:
          "https://danceblue.org/wp-content/uploads/2025/02/DBehind-The-Scenes-FR.mp3",
      }}
    />
  );
}
