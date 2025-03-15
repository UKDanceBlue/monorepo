import { useLocalSearchParams } from "expo-router";

export default function Team() {
  const { team } = useLocalSearchParams<{ team: string }>();
  return team;
}
