import { useColorScheme as useNativewindColorScheme } from "nativewind";

export function useColorScheme() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();
  return {
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}

export function useColorSchemeValues<A, B>(lightValue: A, darkValue: B): A | B {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? darkValue : lightValue;
}
