import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import { FontAwesome } from "~/lib/icons/FontAwesome";
import { FontAwesome5 } from "~/lib/icons/FontAwesome5";

const HeaderIcons = () => {
  const { navigate } = useRouter();

  return (
    <View className="flex-row gap-4 items-center mr-4">
      <TouchableOpacity onPress={() => navigate("/notifications", {})}>
        <FontAwesome name="bell" size={18} className="color-primary" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate("/profile", {})}>
        <FontAwesome5
          name="user-alt"
          color="#0032A0"
          size={18}
          className="color-primary text-xl"
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderIcons;
