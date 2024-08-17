import {
  addAssetsToAlbumAsync,
  createAlbumAsync,
  createAssetAsync,
  getAlbumAsync,
  usePermissions,
} from "expo-media-library";
import { useCallback } from "react";

const ALBUM_NAME = "DBMoments";

export function useSaveMoment(): {
  saveMoment?: (url: string) => Promise<string | undefined>;
  ask?: () => Promise<void>;
} {
  const [permissionResponse, requestPermission] = usePermissions();

  const saveMoment = useCallback(
    async (url: string) => {
      try {
        if (!permissionResponse || !permissionResponse.granted) {
          return;
        }

        const asset = await createAssetAsync(url);

        // There seems to be an issue with the types here, so we need to add null to the return type
        const album = (await getAlbumAsync(ALBUM_NAME)) as Awaited<
          ReturnType<typeof getAlbumAsync>
        > | null;
         
        await (!album ? createAlbumAsync(ALBUM_NAME, asset, false) : addAssetsToAlbumAsync([asset], album, false));

        return undefined;
      } catch (error) {
        return String(error);
      }
    },
    [permissionResponse]
  );

  if (
    permissionResponse &&
    !permissionResponse.granted &&
    permissionResponse.canAskAgain
  ) {
    return {
      ask: async () => {
        await requestPermission();
      },
    };
  } else if (permissionResponse && permissionResponse.granted) {
    return { saveMoment };
  } else {
    return {};
  }
}
