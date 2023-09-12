import { Center, Image, Spinner } from "native-base";
import { useEffect, useState } from "react";

import { useFirebase } from "../../../context";
import { DownloadableImage, FirestoreImage, isFirestoreImage, parseFirestoreImage } from "../../../types/commonStructs";
import { universalCatch } from "../../logging";

export const FirestoreImageView = (
  props:
  // Exclude<
  // Parameters<typeof Image>[0],
  // [
  //   Parameters<typeof Image>[0]["source"],
  //   Parameters<typeof Image>[0]["src"]
  // ]
  // > &
  { source: FirestoreImage }
) => {
  const { fbStorage } = useFirebase();
  const [ downloadableImage, setDownloadableImage ] = useState<DownloadableImage>();

  useEffect(() => {
    if (!isFirestoreImage(props.source)) {
      return;
    } else {
      parseFirestoreImage(props.source, fbStorage).then(setDownloadableImage).catch(universalCatch);
    }
  }, [ fbStorage, props.source ]);

  return downloadableImage == null ? <Center><Spinner /></Center> : <Image
    {...props}
    source={{
      uri: downloadableImage.url,
      width: downloadableImage.width,
      height: downloadableImage.height
    }} />;
};
