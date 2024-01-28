import { FontAwesome5 } from "@expo/vector-icons";
// import DBLogoCondensed from "../../../../../assets/svgs/DBLogoCondensed";
import DBRibbon from "../../../../../assets/svgs/DBRibbon";
import { PixelRatio, useWindowDimensions } from "react-native";
import { Box, Button, HStack, Text, View } from "native-base";
import { universalCatch } from "@common/logging";
import { openURL } from "expo-linking";
import AudioPlayer from "@common/components/AudioPlayer";
import { showMessage } from "@common/util/alertUtils";
import { Audio } from "expo-av";

export const ExplorerItem = ({
    resourceLink = "https://danceblue.org",
    isText = false,
    blogTitle = "",
    blogContent = "",
    isAudio = false,
    isInstagram = false,
    isTikTok = false,
    isYouTube = false,
}: {
    resourceLink: string;
    isText: boolean;
    blogTitle: string;
    blogContent: string;
    isAudio: boolean;
    isInstagram: boolean;
    isTikTok: boolean;
    isYouTube: boolean;
}) => {
    const { fontScale } = useWindowDimensions();

    // DBLogoCondensed is currently broken
    //let icon = <DBLogoCondensed svgProps={{ width: screenWidth * 0.12, height: screenWidth * 0.12 }} letterColor="#0032A0" ribbonColor="#FFC72C"/>;
    let icon = <DBRibbon svgProps={{ width: PixelRatio.get() * 12, height: PixelRatio.get() * 12 }}/>;

    const headerFontSize = fontScale * 15;
    const blogTitleFontSize = fontScale * 16;
    const blogContentFontSize = fontScale * 14;

    let source = "Our Imagination";
    let link = "https://danceblue.org";
    let content = 
        <>
            <Text fontSize={blogContentFontSize} textAlign="justify" fontFamily="">DanceBlue is an entirely student-run organization that fundraises year-round for the DanceBlue Hematology/Oncology Clinic and culminates in a 24-hour no sitting, no sleeping dance marathon.</Text>
        </>;

    if (isText) {
        icon = <FontAwesome5 name="compass" size={PixelRatio.get() * 9} color="#0032A0"/>
        source = "DB Blog";
        link = "https://danceblue.org/news";
        content = 
            <View width="100%">
                <Text textAlign="center" fontSize={blogTitleFontSize}>{blogTitle}</Text>
                <Text fontSize={blogContentFontSize} textAlign="justify" fontFamily=""> { blogContent } </Text>
                <Box width="full" alignItems="center">
                    <Button onPress={() => { openURL(resourceLink).catch(universalCatch) }}>Read More!</Button>
                </Box>
            </View>;

    } else if (isAudio) {
        icon = <FontAwesome5 name="music" size={PixelRatio.get() * 9} color="#0032A0"/>
        source = "DB Podcast";
        link = "https://danceblue.org/category/podcast";

        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
        }).catch(showMessage);

        const sound = new Audio.Sound();
        sound.loadAsync({ uri: resourceLink });

        content = 
            <>
                <View>
                    <Text textAlign="center" fontSize={blogTitleFontSize}>{blogTitle}</Text>
                    <AudioPlayer
                        sound={sound}
                        loading={!sound}
                        title=""
                        titleLink="https://danceblue.org/category/podcast/"
                    />
                </View>
            </>;
    } else if (isInstagram) {
        icon = <FontAwesome5 name="instagram" size={PixelRatio.get() * 9} color="#0032A0"/>
        source = "Instagram";
        link = "https://instagram.com/uk_danceblue";
        content = 
            <>
                <Text>Instagram</Text>
            </>;
    } else if (isTikTok) {
        icon = <FontAwesome5 name="tiktok" size={PixelRatio.get() * 9} color="#0032A0"/>
        source = "TikTok";
        link = "https://tiktok.com/@uk_danceblue";
        content = 
            <>
                <Text>TikTok</Text>
            </>;
    } else if (isYouTube) {
        icon = <FontAwesome5 name="youtube" size={PixelRatio.get() * 9} color="#0032A0"/>
        source = "YouTube";
        link = "https://www.youtube.com/channel/UCcF8V41xkzYkZ0B1IOXntjg";
        content = 
            <>
                <Text>YouTube</Text>
            </>;
    }

    return (
        <View /* borderBottomColor="#c5c6d0" borderBottomWidth={0.5} */ marginTop={5}>
            { /* THIS IS THE HEADER ROW */ }
            <View borderBottomColor="#c5c6d0" borderBottomWidth={0.5}>
                <HStack alignItems="center" marginLeft={2} marginY={2}>
                    {icon}
                    <Text marginLeft={2} fontSize={headerFontSize} onPress={() => { openURL(link).catch(universalCatch) }}>{source}</Text>
                </HStack>
            </View>

            { /* THIS IS THE CONTENT ROW */ }
            <HStack margin={2}>
                {content}
            </HStack>
        </View>
    );
};