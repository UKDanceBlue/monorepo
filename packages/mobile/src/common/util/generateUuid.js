import * as Random from "expo-random";

// Magic code to simplistically generate a uuid (not uid) for this device from SO - https://stackoverflow.com/a/2117523
export default function generateUuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (Random.getRandomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
  );
}
