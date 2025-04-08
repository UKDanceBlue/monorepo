import MarkdownDisplay, {
  renderRules,
} from "@ukdanceblue/react-native-markdown-display";
import { Image } from "expo-image";
import {
  type ExternalPathString,
  Link,
  type RelativePathString,
} from "expo-router";
import type { ComponentProps } from "react";

import {
  BlockQuote,
  Code,
  H1,
  H2,
  H3,
  H4,
  P,
} from "~/components/ui/typography";

export function Markdown(
  props: Omit<ComponentProps<typeof MarkdownDisplay>, "rules">
) {
  return (
    <MarkdownDisplay
      {...props}
      rules={{
        ...renderRules,
        heading1: (node, children, _, styles) => {
          return (
            <H1 key={node.key} style={styles.heading1}>
              {children}
            </H1>
          );
        },
        heading2: (node, children, _, styles) => {
          return (
            <H2 key={node.key} style={styles.heading2}>
              {children}
            </H2>
          );
        },
        heading3: (node, children, _, styles) => {
          return (
            <H3 key={node.key} style={styles.heading3}>
              {children}
            </H3>
          );
        },
        heading4: (node, children, _, styles) => {
          return (
            <H4 key={node.key} style={styles.heading4}>
              {children}
            </H4>
          );
        },
        paragraph: (node, children, _, styles) => {
          return (
            <P key={node.key} style={styles.paragraph}>
              {children}
            </P>
          );
        },
        blockquote: (node, children, _, styles) => {
          return (
            <BlockQuote key={node.key} style={styles.blockquote}>
              {children}
            </BlockQuote>
          );
        },
        code_block: (node, _, __, styles, inheritedStyles) => {
          return (
            <Code
              key={node.key}
              style={[inheritedStyles?.code_block, styles.code_block]}
            >
              {node.content}
            </Code>
          );
        },
        code_inline: (node, _, __, styles, inheritedStyles) => {
          return (
            <Code
              key={node.key}
              style={[inheritedStyles?.code_inline, styles.code_inline]}
            >
              {node.content}
            </Code>
          );
        },
        link: (node, children, _, styles, _onLinkPress) => {
          const href = String(node.attributes?.href);

          return (
            <Link
              key={node.key}
              href={href as RelativePathString | ExternalPathString}
              style={styles.link}
            >
              {children}
            </Link>
          );
        },
        image: (node, _, __, styles) => {
          const href = String(node.attributes?.src);
          const alt = node.attributes?.alt;

          return (
            <Link
              key={node.key}
              href={href as RelativePathString | ExternalPathString}
              style={styles.image}
            >
              <Image
                source={{ uri: href }}
                alt={alt ? String(alt) : undefined}
                // @ts-expect-error - Its fine
                style={styles.image}
              />
            </Link>
          );
        },
      }}
    />
  );
}
