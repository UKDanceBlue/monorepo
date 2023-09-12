import { Image, Text, View } from "native-base";
import { StyleSheet } from "react-native";

/**
 * A badge icon for use with profiles
 */
const Badge = ({
  imageURL, name
}: {
  imageURL: string;
  name?: string;
}) => {
  return (
    <View style={styles.container}>
      <Image style={styles.icon} source={{ uri: imageURL }} alt={name ? `Icon for ${name}` : "Badge Icon"} />
      {name && <Text>{name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  icon: {
    height: 50,
    width: 50,
  },
});

export default Badge;
