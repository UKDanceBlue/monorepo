import { Text } from "native-base";
import { FlatGrid } from "react-native-super-grid";

import Badge from "../Badge";

/**
 * A row of a user's {@link Badge}s loaded from Firebase
 */
const Badges = ({ badges }: { badges: { name: string; image:string }[] }) => (
  <>
    {badges.length === 0 ? (
      <Text>You currently have no badges. Check back later to see if you&apos;ve earned any!</Text>
    ) : (
      <FlatGrid
        itemDimension={130}
        data={badges}
        spacing={10}
        renderItem={({ item }: { item: { name: string; image:string } } ) => (
          <Badge name={item.name} imageURL={item.image} />
        )}
      />
    )}
  </>
);

export default Badges;
