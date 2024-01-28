import { VStack, ScrollView } from "native-base";
import { ExplorerItem } from "./ExplorerItem";
import { useNetworkStatus } from "@common/customHooks";
import { useState } from "react";
import { FeedItem, parse } from "react-native-rss-parser";
import { DateTime } from "luxon";

export const ExplorerScreen = () => {
    const [{ isConnected }, isNetStatusLoaded] = useNetworkStatus();
    const [blogPosts, setBlogPosts] = useState<FeedItem[] | undefined>();
    const [podcasts, setPodcasts] = useState<FeedItem[] | undefined>();
    const [instagramPosts, setInstagramPosts] = useState<undefined>();
    const [tiktokPosts, setTikTokPosts] = useState<undefined>();
    const [youtubePosts, setYoutubePosts] = useState<undefined>();

    const loadFeed = async () => {
        try {
            const dbWebsiteRSS = await fetch("https://danceblue.org/feed");
            const dbWebsiteXML = await dbWebsiteRSS.text();
            const dbWebsiteParsed = await parse(dbWebsiteXML);

            const blogPosts = dbWebsiteParsed.items
                .filter((item) =>
                    item.categories.some((category) => category?.name !== "Podcast")
                );

            setBlogPosts(blogPosts);

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
        } catch (error) {
            console.error(error);
        }

        // TODO: Implement Instagram, TikTok, YouTube RSS if possible
    };

    /*
        TO SORT FeedItem[]      (blog posts and podcasts)

            .map((item) => ({
                ...item,
                dateTimePublished: DateTime.fromRFC2822(item.published),
            }))
            .sort((a,b) =>
                a.dateTimePublished > b.dateTimePublished
                ? -1
                : a.dateTimePublished > b.dateTimePublished
                ? 1
                : 0
            );
    */

    loadFeed();
    
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

                <ExplorerItem isText={false} resourceLink={""} blogTitle={""} blogContent={""} isAudio={false} isInstagram={false} isTikTok={false} isYouTube={false}/>
                <ExplorerItem 
                    isText={true} resourceLink={""} 
                    blogTitle={"Celebrating 25 Years of Jarret's Joy Cart"} 
                    blogContent={"25 years ago, despite six cancer diagnoses and an amputated leg, Jarrett Mynear, the inspiration for DanceBlue, began his mission to spread joy in the world one toy at a time. Refusing to let his illness hold him back and seeing the need for a spark in the Kentucky Children’s Oncology Clinic he was treated in, Jarrett began his Joy Cart. It started small, [...]"} 
                    isAudio={false} isInstagram={false} isTikTok={false} isYouTube={false}/>
                {/* 
                    <ExplorerItem 
                        isText={false} 
                        resourceLink={"https://danceblue.org/wp-content/uploads/2024/01/DBPodcast1.mp3"} 
                        blogTitle={"Podcast- DB Behind the Scenes"} blogContent={""}
                        isAudio={true} isInstagram={false} isTikTok={false} isYouTube={false}/>
                */}
                <ExplorerItem isText={false} resourceLink={""} blogTitle={""} blogContent={""} isAudio={false} isInstagram={true} isTikTok={false} isYouTube={false}/>
                <ExplorerItem isText={false} resourceLink={""} blogTitle={""} blogContent={""} isAudio={false} isInstagram={false} isTikTok={true} isYouTube={false}/>
                <ExplorerItem isText={false} resourceLink={""} blogTitle={""} blogContent={""} isAudio={false} isInstagram={false} isTikTok={false} isYouTube={true}/>
            </ScrollView>
        </VStack>
    );
};