import { Alert } from "react-native";

import { Logger } from "@/util/logger/Logger";
import type { ExtraLogArgs } from "@/util/logger/transport";

import { useOnce } from "./useOnce";

const showAlert = (message: string) => {
  Alert.alert("Error", message, [{ text: "Ok" }]);

  // Sentry.captureFeedback({});
};

/**
 * @param message The message to show in the logs and to the user
 * @param once Should the alert only show once
 * @param otherData Any other data to log
 * @returns A function to handle the error
 */
export function useErrorHandler(
  message: string,
  once = false,
  otherData: Omit<ExtraLogArgs, "error"> = {}
) {
  const showAlertOnce = useOnce(showAlert);
  const showAlertFn = once ? showAlertOnce : showAlert;

  return function handleError(error: unknown) {
    showAlertFn(message);
    Logger.error(message, { ...otherData, error });
  };
}
