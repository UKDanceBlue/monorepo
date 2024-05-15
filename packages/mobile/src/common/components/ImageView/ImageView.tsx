import type { FragmentType } from "@ukdanceblue/common/dist/graphql-client-public";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/dist/graphql-client-public";
import { Image, type ImageProps } from "expo-image";

export const ImageViewFragment = graphql(/* GraphQL */ `
  fragment ImageViewFragment on ImageNode {
    id
    url
    thumbHash
    alt
    width
    height
    mimeType
  }
`);

interface ImageViewProps extends ImageProps {
  imageFragment?: FragmentType<typeof ImageViewFragment> | null;
  renderWidth?: number;
  renderHeight?: number;
  source?: never;
  alt?: never;
}

export default function ImageView({
  imageFragment,
  renderWidth,
  renderHeight,
  ...imageProps
}: ImageViewProps) {
  const imageData = getFragmentData(ImageViewFragment, imageFragment);

  let width = renderWidth;
  let height = renderHeight;
  if (imageData?.width && imageData.height) {
    const ratio = imageData.width / imageData.height;
    if (width && !height) {
      height = width / ratio;
    } else if (!width && height) {
      width = height * ratio;
    }
  }

  return (
    <Image
      {...imageProps}
      alt={imageData?.alt ?? undefined}
      source={{
        uri: imageData?.url?.toString() ?? undefined,
        thumbhash: imageData?.thumbHash ?? undefined,
        height: imageData?.height,
        width: imageData?.width,
      }}
      style={[imageProps.style, { width, height }]}
    />
  );
}
