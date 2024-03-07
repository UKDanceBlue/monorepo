import { createContext } from "react";

export const themeConfigContext = createContext<{
  dark: boolean;
  setDark: (dark: boolean) => void;
}>({
  dark: false,
  setDark: () => {},
});
