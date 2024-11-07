import { useEffect, useState } from "react";

import { API_BASE_URL } from "#config/api";
import { useAntFeedback } from "#hooks/useAntFeedback";

export function ServerCanary() {
  const [isServerReachable, setIsServerReachable] = useState<
    boolean | undefined
  >(undefined);
  const { showWarningNotification, appNotification } = useAntFeedback();
  const [notificationKey, setNotificationKey] = useState<string | null>(null);

  useEffect(() => {
    function check() {
      fetch(new URL("/api/healthcheck", API_BASE_URL))
        .then(async (res) => {
          alert("Server check");
          if (res.ok) {
            const text = await res.text();
            setIsServerReachable(text === "OK");
          } else {
            throw new Error("Server is not reachable");
          }
        })
        .catch(() => {
          setIsServerReachable(false);
        })
        .finally(() => {
          setTimeout(() => {
            check();
          }, 5000);
        });
    }
    check();
  }, []);

  useEffect(() => {
    if (isServerReachable === false && !notificationKey) {
      showWarningNotification({
        message: "Server is not reachable",
        duration: 0,
        key: "server-not-reachable-warning",
      });
      setNotificationKey("server-not-reachable-warning");
    } else if (isServerReachable === true && notificationKey) {
      appNotification.destroy(notificationKey);
      setNotificationKey(null);
    }
  }, [
    appNotification,
    isServerReachable,
    notificationKey,
    showWarningNotification,
  ]);

  return null;
}
