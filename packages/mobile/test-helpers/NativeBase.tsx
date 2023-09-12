import { render } from "@testing-library/react-native";
import { NativeBaseProvider, NativeBaseProviderProps } from "native-base";
import { ReactElement } from "react";

const inset = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
} as const;

/**
 * Editing this function will require an update to test snapshots.
 * @param element The element to test.
 * @param nativeBaseProps
 * @returns The output of *render()*, wrapped with the NativeBaseProvider.
 */
export const renderWithNativeBase = (element: ReactElement, nativeBaseProps: NativeBaseProviderProps = {}) => {
  return render(
    <NativeBaseProvider
      initialWindowMetrics={inset}
      colorModeManager={nativeBaseProps.colorModeManager}
      disableContrastText={nativeBaseProps.disableContrastText}
      theme={nativeBaseProps.theme}
      config={nativeBaseProps.config}
      isSSR={nativeBaseProps.isSSR}
    >
      {element}
    </NativeBaseProvider>
  );
};
