import firebaseFirestore from "@react-native-firebase/firestore";
import { Box, Heading, ScrollView, Text, View, useTheme } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { LegacyFirestoreSponsor } from "../../../types/FirestoreSponsor";
import { useThemeColors } from "../../customHooks";
import { universalCatch } from "../../logging";
import SponsorCard from "../SponsorCard";

const SponsorsBlock = () => {
  const themes = useTheme();
  const {
    primary, secondary, tertiary, success, warning, error, danger
  } = useThemeColors();
  const [ sponsors, setSponsors ] = useState<LegacyFirestoreSponsor[]>([]);

  useEffect(() => {
    let shouldUpdateState = true;
    async function getSnapshot() {
      const dbSponsors: LegacyFirestoreSponsor[] = [];
      const snapshot = await firebaseFirestore().collection("sponsors").get();
      snapshot.forEach((document) => {
        dbSponsors.push(document.data());
      });
      if (shouldUpdateState) {
        setSponsors(dbSponsors);
      }
    }
    getSnapshot().catch(universalCatch);
    return () => {
      shouldUpdateState = false;
    };
  }, []);

  const cards = sponsors.map((sponsor, i) => (
    <SponsorCard
      name={sponsor.name ?? ""}
      imagePath={sponsor.logo ?? ""}
      sponsorLink={sponsor.link}
      key={i}
      descrption={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."} />
  ));
  
  return (
    <View height="100%" flex={1} alignContent="flex-end">
      <Box flexDirection="column" flex={1} alignItems="center">
        {cards}
      </Box>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 20,
    height: 50,
    flexDirection: "column",
  },
  top: {
    flex: 1,
    backgroundColor: "grey",
  },
  middle: {
    flex: 1,
    backgroundColor: "beige",
  },
  bottom: {
    flex: 1,
    backgroundColor: "pink",
  },
});

export default SponsorsBlock;
