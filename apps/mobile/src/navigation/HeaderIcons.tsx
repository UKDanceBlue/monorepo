import { Entypo, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useTheme as useNavigationTheme } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "native-base";
import { Linking, PixelRatio, TouchableOpacity, useWindowDimensions } from "react-native";

import DanceBlueRibbon from "../../assets/svgs/DBRibbon";
import { universalCatch } from "../common/logging";
import { RootStackParamList } from "../types/navigationTypes";

const HeaderIcons = ({ navigation }: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{ flexDirection: "row", width: Math.round(width * 0.15), justifyContent: "space-between", marginRight: Math.round(width * 0.025), alignItems: "center" }}>
      {/* <TouchableOpacity>
        <DanceBlueRibbon svgProps={{ width: width*0.1, height: width*0.1 }}/>
      </TouchableOpacity> */}
      {/* We'll need to wait until next year
      <TouchableOpacity onPress={async () => {
        if (
          await Linking.canOpenURL(
            "https://www.danceblue.org/dancebluetique/"
          ).catch(universalCatch)
        ) {
          Linking.openURL(
            "https://www.danceblue.org/dancebluetique/"
          ).catch(universalCatch);
        }
      }}>
        <Entypo
          name="shop"
          color="#0032A0"
          style={{ textAlignVertical: "center", fontSize: PixelRatio.get() * 8 }}
        />
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
        <FontAwesome
          name="bell"
          color="#0032A0"
          style={{ textAlignVertical: "center", fontSize: PixelRatio.get() * 8 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <FontAwesome5
          name="user-alt"
          color="#0032A0"
          style={{ textAlignVertical: "center", fontSize: PixelRatio.get() * 8 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderIcons;
