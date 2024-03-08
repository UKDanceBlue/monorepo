import { Logger } from "@common/logger/Logger";
import { showPrompt } from "@common/util/alertUtils";
import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
  useUpdates,
} from "expo-updates";
import { useEffect } from "react";

export function useUpdateChecker() {
  const {
    currentlyRunning,
    isUpdateAvailable,
    isUpdatePending,
    availableUpdate,
    checkError,
    downloadError,
    downloadedUpdate,
    initializationError,
  } = useUpdates();

  useEffect(() => {
    Logger.info("Checking for updates", { context: { currentlyRunning } });
    checkForUpdateAsync().catch((error: unknown) => {
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
      Logger.info("Update available", { context: { availableUpdate } });
      showPrompt({
        title: "Update Available",
        message:
          "A new version of the app is available. Would you like to download it now?",
        onConfirm: async () => {
          try {
            await fetchUpdateAsync();
          } catch (error) {
            Logger.error("Error fetching update", { error });
          }
        },
      });
    }
  }, [availableUpdate, isUpdateAvailable]);

  useEffect(() => {
    if (isUpdatePending) {
      Logger.info("Update pending", { context: { downloadedUpdate } });
      showPrompt({
        title: "Update Pending",
        message:
          "A new version of the app has been downloaded. Would you like to reload the app to apply it?",
        onConfirm: async () => {
          try {
            await reloadAsync();
          } catch (error) {
            Logger.error("Error reloading app", { error });
          }
        },
      });
    }
  }, [downloadedUpdate, isUpdatePending]);
}
