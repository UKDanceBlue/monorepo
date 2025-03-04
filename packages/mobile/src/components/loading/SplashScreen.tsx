import { hide } from "expo-splash-screen";
import { type PropsWithChildren, useEffect } from "react";

export function SplashScreen({
  show,
  children,
}: PropsWithChildren<{ show: boolean }>) {
  useEffect(() => {
    if (!show) {
      hide();
    }
  }, [show]);

  return show ? children : null;
}
