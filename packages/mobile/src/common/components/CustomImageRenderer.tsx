import type { ASTNode } from "@jonasmerlin/react-native-markdown-display";
import type { Key } from "react";
import { useEffect, useState } from "react";
import type { IFitImageProps } from "react-native-fit-image";
import FitImage from "react-native-fit-image";

import { Logger } from "#common/logger/Logger";
import type { MarkdownRuleStyles } from "#common/markdownRules";

export const CustomImageRenderer = ({
  node,
  styles,
  allowedImageHandlers,
  defaultImageHandler,
}: {
  node: ASTNode;
  styles: MarkdownRuleStyles;
  allowedImageHandlers: string[];
  defaultImageHandler: string | null | undefined;
}) => {
  const src = node.attributes.src ? String(node.attributes.src) : undefined;
  const alt = node.attributes.alt ? String(node.attributes.alt) : undefined;
  const title = node.attributes.title
    ? String(node.attributes.title)
    : undefined;

  const [imageProps, setImageProps] = useState<
    (IFitImageProps & { key?: Key }) | undefined | null
  >(null);
  useEffect(() => {
    // we check that the source starts with at least one of the elements in allowedImageHandlers
    const show = allowedImageHandlers.some((value) => {
      return src?.toLowerCase().startsWith(value.toLowerCase()) ?? false;
    });

    if (!show) {
      if (defaultImageHandler == null) {
        return;
      } else if (src?.startsWith("gs://")) {
        Logger.error("Firebase storage is no longer supported", {
          context: {
            src,
          },
        });
      } else {
        let srcWithoutProtocol = src ?? "";
        if (srcWithoutProtocol.includes("://")) {
          srcWithoutProtocol = srcWithoutProtocol.substring(
            srcWithoutProtocol.indexOf("://") + 3
          );
        }
        setImageProps({
          // @ts-expect-error - TODO: Fix these errors, seems ok for now
          style: styles._VIEW_SAFE_image,
          accessibilityLabel: alt ?? title,
          source: { uri: `${defaultImageHandler}${srcWithoutProtocol}` },
        });
      }
    } else {
      setImageProps({
        // @ts-expect-error - TODO: Fix these errors, seems ok for now
        style: styles._VIEW_SAFE_image,
        accessibilityLabel: alt ?? title,
        source: { uri: src },
      });
    }
  }, [
    allowedImageHandlers,
    alt,
    defaultImageHandler,
    src,
    styles._VIEW_SAFE_image,
    title,
  ]);

  if (imageProps == null) {
    return null;
  } else {
    return (
      <FitImage
        {...imageProps}
        {...((alt ?? title)
          ? {
              accessible: true,
              accessibilityLabel: alt ?? title,
            }
          : {})}
      />
    );
  }
};
