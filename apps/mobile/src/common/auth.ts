import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FirebaseFunctionsTypes } from "@react-native-firebase/functions";
import { AuthError, useAuthRequest, useAutoDiscovery } from "expo-auth-session";
import { createURL } from "expo-linking";
import { getRandomBytes } from "expo-random";
import { useRef, useState } from "react";

export const useLinkBlueLogin = (fbAuth: FirebaseAuthTypes.Module, fbFunctions: FirebaseFunctionsTypes.Module): [boolean, () => void, FirebaseAuthTypes.UserCredential | null, AuthError | Error | null] => {
  const discovery = useAutoDiscovery("https://login.microsoftonline.com/2b30530b-69b6-4457-b818-481cb53d42ae/v2.0");

  const nonce = useRef(getRandomBytes(10).join(""));

  const [
    ,, promptAsync
  ] = useAuthRequest({
    clientId: "71e79019-a381-4be1-8625-a1978edc8d04",
    redirectUri: createURL("auth"),
    scopes: [
      "openid", "profile", "email", "offline_access", "User.read"
    ],
    responseType: "token",
    extraParams: { nonce: nonce.current }
  }, discovery);

  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<AuthError | Error | null>(null);
  const [ userCredential, setUserCredential ] = useState<FirebaseAuthTypes.UserCredential | null>(null);

  const trigger = () => {
    setLoading(true);
    promptAsync({}).then(async (result) => {
      // Try {
      switch (result.type) {
      case "success":
        if (result.authentication?.accessToken == null) {
          setError(new Error("Authentication popup reported success but no returned authentication data"));
          break;
        } else {
          const generateCustomToken = fbFunctions.httpsCallable("generateCustomToken");
          const customToken = await generateCustomToken({
            accessToken: result.authentication.accessToken,
            // Nonce: nonce.current
          }) as { data: string };

          setUserCredential(await fbAuth.signInWithCustomToken(customToken.data));
        }
        break;

      case "error":
        setError(result.error ?? null);
        break;

      case "cancel":
      case "locked":
        break;

      default:
        setError(new Error(`Unexpected result type: ${result.type}`));
        break;
      }
      // } catch (error) {
      //   SetError(error as Error);
      // } finally {
      setLoading(false);
      // }
    }).catch(console.error);
  };


  return [
    loading, trigger, userCredential, error
  ];
};
