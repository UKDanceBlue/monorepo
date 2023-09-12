import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { useFirebase } from "../../../../context";

export interface MoraleTeamNames {
  [key: string]: string;
}

export interface MoraleTeamPoints {
  [key: string]: number;
}

export const useFirestoreMoralePoints = () => {
  const [ loadingNames, setLoadingNames ] = useState(true);
  const [ loadingPoints, setLoadingPoints ] = useState(true);

  const { fbFirestore } = useFirebase();
  const [ teamNames, setTeamNames ] = useState<MoraleTeamNames | null>(null);
  const [ teamPoints, setTeamPoints ] = useState<MoraleTeamPoints | null>(null);
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null);

  const handleError = useCallback((error: unknown) => {
    console.error(error);
    if (error instanceof Error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage("Unknown error");
    }
  }, []);


  useEffect(() => {
    const pointsDoc = fbFirestore.doc("marathon/2023/morale/points");
    const handleSnapshot = (snapshot: FirebaseFirestoreTypes.DocumentSnapshot) => {
      try {
        const data = snapshot.data();
        if (data) {
          setTeamPoints(data);
        } else {
          setErrorMessage("No points data");
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoadingPoints(false);
      }
    };

    pointsDoc.get().then(handleSnapshot).catch(handleError)
      .finally(() => setLoadingPoints(false));
    const unsubscribe = pointsDoc.onSnapshot(handleSnapshot, handleError);

    return unsubscribe;
  }, [ fbFirestore, handleError ]);

  useEffect(() => {
    const teamNamesDoc = fbFirestore.doc("marathon/2023/morale/teams");
    const handleSnapshot = (snapshot: FirebaseFirestoreTypes.DocumentSnapshot) => {
      try {
        const data = snapshot.data();
        if (data) {
          setTeamNames(data);
        } else {
          setErrorMessage("No team names data");
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoadingNames(false);
      }
    };

    teamNamesDoc.get().then(handleSnapshot).catch(handleError)
      .finally(() => setLoadingNames(false));
    const unsubscribe = teamNamesDoc.onSnapshot(handleSnapshot, handleError);

    return unsubscribe;
  }, [ fbFirestore, handleError ]);

  return { teamNames, teamPoints, errorMessage, loading: loadingNames || loadingPoints };
};
