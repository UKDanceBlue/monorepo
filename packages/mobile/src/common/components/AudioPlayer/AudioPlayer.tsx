// Import third-party dependencies
import { FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { canOpenURL, openURL } from "expo-linking";
import { AspectRatio, Box, HStack, IconButton, Link, Slider, Spinner, Text, VStack, useTheme } from "native-base";
import { useEffect, useRef, useState } from "react";

import { universalCatch } from "../../logging";
import { showMessage } from "../../util/alertUtils";

/**
 * A row-based component showing a target name, their rank (if applicable), and their points
 */
const AudioPlayer = ({
  sound, loading, title, titleLink
}: { sound?: Audio.Sound; loading?: boolean; title?: string; titleLink?: string }) => {
  const { colors } = useTheme();
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ duration, setDuration ] = useState<number | undefined>();
  const [ currentTime, setCurrentTime ] = useState(0);
  const [ seekTime, setSeekTime ] = useState(0);
  const seeking = useRef(false);

  function seekTo(value: number) {
    if (!seeking.current) {
      seeking.current = true;
    }
    setSeekTime(value);
  }

  function applySeek(value: number) {
    setSeekTime(value);
    if (sound) {
      sound.setPositionAsync(value, { toleranceMillisAfter: 300, toleranceMillisBefore: 300 }).then(() => {
        seeking.current = false;
      }).catch(showMessage);
    }
  }

  useEffect(() => {
    if (sound) {
      sound.setProgressUpdateIntervalAsync(300).catch(universalCatch);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setDuration(status.durationMillis);
          setCurrentTime(status.positionMillis);
          if (!seeking.current) {
            setSeekTime(status.positionMillis);
          }
        }
      });
    }
    return sound ? () => sound.setOnPlaybackStatusUpdate(null) : undefined;
  }, [sound]);

  useEffect(() => {
    if (sound) {
      if (isPlaying) {
        sound.playAsync().catch(universalCatch);
      } else {
        sound.pauseAsync().catch(universalCatch);
      }
    }
  }, [ isPlaying, sound ]);

  let currentTimeString;
  if (duration != null) {
    if (duration >= 60000) {
      currentTimeString = `${Math.floor((seeking.current ? seekTime : currentTime) / 60000).toString().padStart(2, "0")}:${Math.floor(((seeking.current ? seekTime : currentTime) % 60000) / 1000).toString().padStart(2, "0")}`;
    } else {
      currentTimeString = `${Math.floor((seeking.current ? seekTime : currentTime) / 1000).toString().padStart(2, "0")}`;
    }
  } else {
    currentTimeString = "--:--";
  }
  let durationString;
  if (duration != null) {
    if (duration >= 60000) {
      durationString = `${Math.floor(duration / 60000).toString().padStart(2, "0")}:${Math.floor((duration % 60000) / 1000).toString().padStart(2, "0")}`;
    } else {
      durationString = `${Math.floor(duration / 1000).toString().padStart(2, "0")}`;
    }
  } else {
    durationString = "--:--";
  }

  return (
    <VStack
      flex={1}
      _light={{ backgroundColor: colors.coolGray[400] }}
      _dark={{ backgroundColor: colors.coolGray[900] }}
      m={"2"}
      px={"2"}
      py={"1"}
      borderRadius={5}
      shadow="6"
      height="full">
      {title && (titleLink == null
        ? <Text
          flex={2}
          textAlign={"center"}>
          {title}
        </Text>
        : <Link
          flex={2}
          onPress={() => {
            canOpenURL(titleLink)
              .then((canOpen) => canOpen && openURL(titleLink))
              .then((openedSuccessfully) => {
                if (!openedSuccessfully) {
                  showMessage("Could not open link");
                }
              })
              .catch(showMessage);
          }}
          textAlign={"center"}>
          {title}
        </Link>)
      }
      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        flex={3}
        _light={{ backgroundColor: colors.coolGray[300] }}
        _dark={{ backgroundColor: colors.coolGray[700] }}
        padding={"1"}
        mx={"1"}
        my={"1"}
        borderRadius={5}
        shadow="3">
        <Box width="10%" mr={"1%"}>
          {
            (loading)
              ? <Spinner />
              : <AspectRatio ratio={1}>
                <IconButton
                  icon={
                    <FontAwesome5
                      name={isPlaying ? "pause" : "play"}
                      size={15}
                      color={colors.white} />
                  }
                  padding={0}
                  margin={"1"}
                  onPress={() => setIsPlaying(!isPlaying)}
                  disabled={duration == null}/>
              </AspectRatio>}
        </Box>
        <Slider
          width="68%"
          defaultValue={0}
          value={(seekTime)}
          minValue={0}
          maxValue={duration ?? 0}
          accessibilityLabel="Progress of the podcast"
          step={300}
          onChange={seekTo}
          onChangeEnd={applySeek}
          isDisabled={duration == null}
          size="sm"
          colorScheme={currentTime === 0 ? "cyan": "primary"}>
          <Slider.Track>
            <Slider.FilledTrack />
          </Slider.Track>
          <Slider.Thumb/>
        </Slider>
        <Text
          width="20%"
          fontSize={"2xs"}
          textAlign={"center"}
          flexWrap="nowrap"
          numberOfLines={1}>{currentTimeString} / {durationString}</Text>
      </HStack>
    </VStack>
  );
};

export default AudioPlayer;
