import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import type { FirebaseStorageTypes } from "@react-native-firebase/storage";
import storage from "@react-native-firebase/storage";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

/** @deprecated */
export const FirebaseContext = createContext<{
  fbFirestore: FirebaseFirestoreTypes.Module;
  fbStorage: FirebaseStorageTypes.Module;
}>({} as never);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    fbFirestore: firestore(),
    fbStorage: storage(),
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

/** @deprecated */
export function useFirebase() {
  return useContext(FirebaseContext);
}
