import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  useUpdates,
} from "expo-updates";
import { useEffect, useState } from "react";

import { Logger } from "~/lib/logger/Logger";

export function useUpdateChecker() {
  const {
    currentlyRunning,
    isUpdateAvailable,
    isUpdatePending,
    checkError,
    downloadError,
    downloadedUpdate,
    initializationError,
  } = useUpdates();

  const [didNotifyPending, setDidNotifyPending] = useState(false);

  useEffect(() => {
    Logger.info("Checking for updates", { context: { currentlyRunning } });
    void checkForUpdateAsync().catch((error: unknown) => {
      if (
        !(
          typeof error === "object" &&
          error &&
          "code" in error &&
          error.code === "ERR_NOT_AVAILABLE_IN_DEV_CLIENT"
        )
      ) {
        Logger.error("Error checking for updates", { error });
      }
      throw error;
    });
  }, [currentlyRunning]);

  useEffect(() => {
    if (initializationError) {
      Logger.error("Error initializing updates", {
        error: initializationError,
      });
    }
  }, [initializationError]);

  useEffect(() => {
    if (
      checkError &&
      !(
        "code" in checkError &&
        checkError.code === "ERR_NOT_AVAILABLE_IN_DEV_CLIENT"
      )
    ) {
      Logger.error("Error checking for updates", { error: checkError });
    }
  }, [checkError]);

  useEffect(() => {
    if (
      downloadError &&
      !(
        "code" in downloadError &&
        downloadError.code === "ERR_NOT_AVAILABLE_IN_DEV_CLIENT"
      )
    ) {
      Logger.error("Error downloading updates", { error: downloadError });
    }
  }, [downloadError]);

  useEffect(() => {
    if (isUpdateAvailable) {
      void fetchUpdateAsync();
    }
  }, [isUpdateAvailable]);

  useEffect(() => {
    if (isUpdatePending && !didNotifyPending) {
      setDidNotifyPending(true);
      Logger.info("Update pending", { context: { downloadedUpdate } });
      // showPrompt(
      //   "A new version of the app has been downloaded. Would you like to reload the app to apply it?",
      //   "Update Pending",
      //   () => undefined,
      //   async () => {
      //     try {
      //       await reloadAsync();
      //     } catch (error) {
      //       Logger.error("Error reloading app", { error });
      //     }
      //   }
      // );
    }
  }, [downloadedUpdate, isUpdatePending]);
}
