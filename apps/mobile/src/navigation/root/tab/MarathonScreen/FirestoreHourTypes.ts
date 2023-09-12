import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { DownloadableImage, FirestoreImage, FirestoreImageJsonV1 } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";
import { useCallback, useEffect, useRef, useState } from "react";

import { universalCatch } from "../../../../common/logging";
import { lookupHourByTime } from "../../../../common/marathonTime";
import { useFirebase } from "../../../../context";

// Found at /marathon/2023/hours/[HOUR NUMBER]
export interface FirestoreHour {
  hourNumber: number;
  hourName: string;
  graphic?: FirestoreImageJsonV1;
  content: string;
}

export function isFirestoreHour(obj: unknown): obj is FirestoreHour {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  return (
    typeof (obj as FirestoreHour).hourNumber === "number" &&
    typeof (obj as FirestoreHour).hourName === "string" &&
    (obj as FirestoreHour).graphic == null|| FirestoreImage.isValidJson((obj as FirestoreHour).graphic) &&
    typeof (obj as FirestoreHour).content === "string"
  );
}

export function useCurrentFirestoreHour(): [boolean, string | null, FirestoreHour | null, DownloadableImage | null, () => Promise<void>] {
  const {
    fbStorage, fbFirestore
  } = useFirebase();

  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);
  const [ hour, setHour ] = useState<FirestoreHour | null>(null);
  const [ hourImage, setHourImage ] = useState<DownloadableImage | null>(null);

  const currentHour = lookupHourByTime(DateTime.now());
  const lastHour = useRef(currentHour);

  const refresh = useCallback(async () => {
    if (currentHour == null) {
      setHour(null);
      setHourImage(null);
      return;
    }

    setError(null);

    setLoading(true);

    const hourRef = fbFirestore.collection("marathon").doc("2023").collection("hours")
      .doc(currentHour.toString());
    let hourDoc: FirebaseFirestoreTypes.DocumentSnapshot;
    try {
      hourDoc = await hourRef.get();
    } catch (e) {
      console.error(e);
      setError((e as Error | Record<string, undefined> | undefined)?.message ?? "Unknown error");
      setHour(null);
      setHourImage(null);
      setLoading(false);
      return;
    }

    if (!hourDoc.exists) {
      setHour(null);
      setHourImage(null);
      setLoading(false);
      return;
    }

    const hourData = hourDoc.data();
    if (hourData == null) {
      setHour(null);
      setHourImage(null);
      setLoading(false);
      return;
    }

    if (isFirestoreHour(hourData)) {
      setHour(hourData);
    } else {
      setHour(null);
      setHourImage(null);
      setError("Invalid data");
      setLoading(false);
      return;
    }

    if (hourData.graphic == null) {
      setHourImage(null);
      setLoading(false);
      return;
    }

    try {
      const image = FirestoreImage.fromJson(hourData.graphic);
      const downloadableImage = await DownloadableImage.fromFirestoreImage(image, (uri: string) => fbStorage.refFromURL(uri).getDownloadURL());
      setHourImage(downloadableImage);
    } catch (e) {
      console.error(e);
      setHourImage(null);
      return;
    } finally {
      setLoading(false);
    }
  }, [
    fbStorage, fbFirestore, currentHour
  ]);

  useEffect(() => {
    if (currentHour) {
      refresh().catch(universalCatch);
    }

    const interval = setInterval(() => {
      if (currentHour !== lastHour.current) {
        lastHour.current = currentHour;
        refresh().catch(universalCatch);
      }
    }, 5000);

    return () => {
      clearTimeout(interval);
    };
  }, [ currentHour, refresh ]);

  return [
    loading, error, hour, hourImage, refresh
  ];
}
