import * as Slider from "@rn-primitives/slider";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useState } from "react";
import type { LayoutRectangle } from "react-native";
import { ActivityIndicator, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  Pressable,
} from "react-native-gesture-handler";

import { FontAwesome5 } from "~/lib/icons/FontAwesome5";
import { universalCatch } from "~/lib/logger/Logger";

export function AudioPlayer({ url }: { url: string }) {
  const player = useAudioPlayer(url);
  const status = useAudioPlayerStatus(player);

  const [trackLayout, setTrackLayout] = useState<LayoutRectangle>();
  const [seekPos, setSeekPos] = useState<number | null>(null);

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .activeCursor("grabbing")
    .onStart(() => {
      player.pause();
    })
    .onUpdate((e) => {
      if (!trackLayout) return;
      const percentage = e.x / trackLayout.width;
      setSeekPos(status.currentTime + percentage * status.duration);
    })
    .onEnd(() => {
      player
        .seekTo(seekPos ?? 0)
        .then(() => {
          setSeekPos(null);
          player.play();
        })
        .catch(universalCatch);
    });

  const percentage = status.duration
    ? ((seekPos ?? status.currentTime) / status.duration) * 100
    : 0;

  const durationHours = Math.floor(status.duration / 1000 / 3600);
  const durationMinutes = Math.floor(((status.duration / 1000) % 3600) / 60);
  const durationSeconds = Math.floor((status.duration / 1000) % 60);
  let formattedDuration = `${durationMinutes
    .toString()
    .padStart(2, "0")}:${durationSeconds.toString().padStart(2, "0")}`;
  if (durationHours) {
    formattedDuration = `${durationHours}:${formattedDuration}`;
  }

  const currentTimeHours = Math.floor(status.currentTime / 1000 / 3600);
  const currentTimeMinutes = Math.floor(
    ((status.currentTime / 1000) % 3600) / 60
  );
  const currentTimeSeconds = Math.floor((status.currentTime / 1000) % 60);
  let formattedCurrentTime = `${currentTimeMinutes
    .toString()
    .padStart(2, "0")}:${currentTimeSeconds.toString().padStart(2, "0")}`;
  if (currentTimeHours) {
    formattedCurrentTime = `${currentTimeHours}:${formattedCurrentTime}`;
  }

  if (!status.isLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      <Slider.Root
        className="flex flex-row items-center flex-1 rounded m-2 py-2 bg-slate-600"
        min={0}
        value={seekPos ?? status.currentTime}
        max={status.duration}
        // onValueChange={(vals) => {
        //   const nextValue = vals[0];
        //   if (typeof nextValue !== "number") return;
        //   player.seekTo(nextValue).catch(universalCatch);
        // }}
      >
        <Text className="text-white mx-2 align-middle">
          {formattedCurrentTime}/{formattedDuration}
        </Text>
        <Slider.Track
          className="h-4 flex-1 rounded-full bg-gray-400"
          onLayout={(e) => setTrackLayout(e.nativeEvent.layout)}
        >
          <Slider.Range
            style={{ width: `${percentage}%` }}
            className="h-2 my-1 rounded-full translate-x-1 bg-slate-600"
          />
          <GestureDetector gesture={panGesture}>
            <Slider.Thumb
              style={{ left: `${percentage}%`, cursor: "grab" as "auto" }}
              className="w-4 h-4 rounded-full  bg-slate-800 relative"
            />
          </GestureDetector>
        </Slider.Track>
        <View className="mx-4">
          {status.playing ? (
            <Pressable onPress={() => player.pause()}>
              <FontAwesome5 name="pause" className="text-white" />
            </Pressable>
          ) : (
            <Pressable onPress={() => player.play()}>
              <FontAwesome5 name="play" className="text-white" />
            </Pressable>
          )}
        </View>
      </Slider.Root>
    </View>
  );
}
