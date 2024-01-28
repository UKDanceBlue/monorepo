import { useNetworkStatus } from "@common/customHooks";
import { ScrollView, VStack } from "native-base";

import { ExplorerItem } from "./ExplorerItem";
import { useExplorerFeed } from "./useExplorerFeed";

export const ExplorerScreen = () => {
  const [{ isConnected }, isNetStatusLoaded] = useNetworkStatus();

  const {} = useExplorerFeed();

  /*

        TODO:

        1. Iterate through all posts types
            - Add them to a map of:
                * <ExplorerItem>
                * dateTimePublished
        2. Sort the master list by their dateTimePublished
        3. Iterate through each map item
            - Add the item to the return component
    */

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <VStack h="full">
      <ScrollView flex={1}>
        <ExplorerItem
          isText={false}
          resourceLink={""}
          blogTitle={""}
          blogContent={""}
          isAudio={false}
          isInstagram={false}
          isTikTok={false}
          isYouTube={false}
        />
        <ExplorerItem
          isText={true}
          resourceLink={""}
          blogTitle={"Celebrating 25 Years of Jarret's Joy Cart"}
          blogContent={
            "25 years ago, despite six cancer diagnoses and an amputated leg, Jarrett Mynear, the inspiration for DanceBlue, began his mission to spread joy in the world one toy at a time. Refusing to let his illness hold him back and seeing the need for a spark in the Kentucky Children’s Oncology Clinic he was treated in, Jarrett began his Joy Cart. It started small, [...]"
          }
          isAudio={false}
          isInstagram={false}
          isTikTok={false}
          isYouTube={false}
        />
        {/*
                    <ExplorerItem
                        isText={false}
                        resourceLink={"https://danceblue.org/wp-content/uploads/2024/01/DBPodcast1.mp3"}
                        blogTitle={"Podcast- DB Behind the Scenes"} blogContent={""}
                        isAudio={true} isInstagram={false} isTikTok={false} isYouTube={false}/>
                */}
        <ExplorerItem
          isText={false}
          resourceLink={""}
          blogTitle={""}
          blogContent={""}
          isAudio={false}
          isInstagram={true}
          isTikTok={false}
          isYouTube={false}
        />
        <ExplorerItem
          isText={false}
          resourceLink={""}
          blogTitle={""}
          blogContent={""}
          isAudio={false}
          isInstagram={false}
          isTikTok={true}
          isYouTube={false}
        />
        <ExplorerItem
          isText={false}
          resourceLink={""}
          blogTitle={""}
          blogContent={""}
          isAudio={false}
          isInstagram={false}
          isTikTok={false}
          isYouTube={true}
        />
      </ScrollView>
    </VStack>
  );
};
