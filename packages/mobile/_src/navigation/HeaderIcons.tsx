import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { View } from "native-base";
import {
  PixelRatio,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

const HeaderIcons = () => {
  const { width } = useWindowDimensions();

  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        width: Math.round(width * 0.15),
        justifyContent: "space-between",
        marginRight: Math.round(width * 0.025),
        alignItems: "center",
      }}
    >
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
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Notifications", {})}
        >
          <FontAwesome
            name="bell"
            color="#0032A0"
            style={{
              textAlignVertical: "center",
              fontSize: PixelRatio.get() * 8,
            }}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Profile", {})}>
        <FontAwesome5
          name="user-alt"
          color="#0032A0"
          style={{
            textAlignVertical: "center",
            fontSize: PixelRatio.get() * 8,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderIcons;
