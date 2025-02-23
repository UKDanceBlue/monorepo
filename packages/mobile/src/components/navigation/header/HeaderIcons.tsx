import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

const HeaderIcons = () => {
  const { navigate } = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginRight: 10,
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
      <TouchableOpacity onPress={() => navigate("/notifications", {})}>
        <FontAwesome
          name="bell"
          color="#0032A0"
          style={{
            textAlignVertical: "center",
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate("/profile", {})}>
        <FontAwesome5
          name="user-alt"
          color="#0032A0"
          style={{
            textAlignVertical: "center",
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderIcons;
