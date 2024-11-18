import {
  hasParents,
  openUrl,
  renderRules,
} from "@ukdanceblue/react-native-markdown-display";
import { Platform } from "expo-modules-core";
import { Box, Divider, Heading, Link, Row, Text, VStack } from "native-base";
import type { FlexAlignType, TextStyle } from "react-native";
import { StyleSheet } from "react-native";

import { CustomImageRenderer } from "./components/CustomImageRenderer";

export interface MarkdownRuleStyle {
  flexDirection: "column" | "row" | "column-reverse" | "row-reverse";
  fontSize: number;
  backgroundColor: string;
  height: number;
  fontWeight: "bold" | "normal";
  fontStyle: "italic" | "normal";
  textDecorationLine:
    | "none"
    | "underline"
    | "line-through"
    | "underline line-through";
  borderColor: string;
  borderLeftWidth: number;
  marginLeft: number;
  paddingHorizontal: number;
  justifyContent:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  marginRight: number;
  flex: number;
  borderWidth: number;
  padding: number;
  borderRadius: number;
  fontFamily: string;
  borderBottomWidth: number;
  marginTop: number;
  marginBottom: number;
  flexWrap: "wrap" | "nowrap" | "wrap-reverse";
  alignItems: FlexAlignType;
  width: string;
}

const markdownTextStyleKeys = new Set<keyof Partial<TextStyle>>([
  "textShadowOffset",
  "color",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "lineHeight",
  "textAlign",
  "textDecorationLine",
  "textShadowColor",
  "fontFamily",
  "textShadowRadius",
  "includeFontPadding",
  "textAlignVertical",
  "fontVariant",
  "letterSpacing",
  "textDecorationColor",
  "textDecorationStyle",
  "textTransform",
  "writingDirection",
]);

const styleRuleKeys = [
  "body",
  "heading1",
  "heading2",
  "heading3",
  "heading4",
  "heading5",
  "heading6",
  "hr",
  "strong",
  "em",
  "s",
  "blockquote",
  "bullet_list",
  "ordered_list",
  "list_item",
  "bullet_list_icon",
  "bullet_list_content",
  "ordered_list_icon",
  "ordered_list_content",
  "code_inline",
  "code_block",
  "fence",
  "table",
  "thead",
  "tbody",
  "th",
  "tr",
  "td",
  "link",
  "blocklink",
  "image",
  "text",
  "textgroup",
  "paragraph",
  "hardbreak",
  "softbreak",
  "pre",
  "inline",
  "span",
] as const;
export type StyleRuleKeysType =
  | (typeof styleRuleKeys)[number]
  | `_VIEW_SAFE_${(typeof styleRuleKeys)[number]}`;

export type MarkdownRuleStyles = Partial<
  Record<StyleRuleKeysType, Partial<MarkdownRuleStyle>>
>;

// This is a modified clone of https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/renderRules.js
export const rules: typeof renderRules = {
  // when unknown elements are introduced, so it wont break
  unknown: renderRules.unknown,

  // The main container
  body: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Box key={node.key} style={styles._VIEW_SAFE_body}>
      {children}
    </Box>
  ),

  // Headings
  heading1: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Heading size="2xl" key={node.key} style={styles.heading1} selectable>
      {children}
    </Heading>
  ),
  heading2: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Heading size="xl" key={node.key} style={styles.heading2} selectable>
      {children}
    </Heading>
  ),
  heading3: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Heading size="lg" key={node.key} style={styles.heading3} selectable>
      {children}
    </Heading>
  ),
  heading4: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Heading size="md" key={node.key} style={styles.heading4} selectable>
      {children}
    </Heading>
  ),
  heading5: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Heading size="sm" key={node.key} style={styles.heading5} selectable>
      {children}
    </Heading>
  ),
  heading6: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Heading size="xs" key={node.key} style={styles.heading6} selectable>
      {children}
    </Heading>
  ),

  // Horizontal Rule
  hr: (node, _children, _parent, styles: MarkdownRuleStyles) => (
    <Divider
      key={node.key}
      style={styles._VIEW_SAFE_hr}
      thickness={styles._VIEW_SAFE_hr?.height}
    />
  ),

  // Emphasis
  strong: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Text bold key={node.key} style={styles.strong} selectable>
      {children}
    </Text>
  ),
  em: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Text italic key={node.key} style={styles.em} selectable>
      {children}
    </Text>
  ),
  s: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Text strikeThrough key={node.key} style={styles.s} selectable>
      {children}
    </Text>
  ),

  // Blockquotes
  blockquote: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Box key={node.key} style={styles._VIEW_SAFE_blockquote}>
      {children}
    </Box>
  ),

  // Lists
  bullet_list: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Box key={node.key} style={styles._VIEW_SAFE_bullet_list}>
      {children}
    </Box>
  ),
  ordered_list: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Box key={node.key} style={styles._VIEW_SAFE_ordered_list}>
      {children}
    </Box>
  ),
  // this is a unique and quite annoying render rule because it has
  // child items that can be styled (the list icon and the list content)
  // outside of the AST tree so there are some work arounds in the
  // AST renderer specifically to get the styling right here
  list_item: (
    node,
    children,
    parent,
    styles: MarkdownRuleStyles,
    inheritedStyles: Partial<MarkdownRuleStyles> = {}
  ) => {
    // we need to grab any text specific stuff here that is applied on the list_item style
    // and apply it onto bullet_list_icon. the AST renderer has some workaround code to make
    // the content classes apply correctly to the child AST tree items as well
    // as code that forces the creation of the inheritedStyles object for list_items
    const refStyle = {
      ...inheritedStyles,
      ...StyleSheet.flatten(styles.list_item),
    };

    const arr: (keyof MarkdownRuleStyle)[] = Object.keys(
      refStyle
    ) as (keyof MarkdownRuleStyle)[];

    const modifiedInheritedStylesObj: TextStyle = {};

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let b = 0; b < arr.length; b++) {
      if (markdownTextStyleKeys.has(arr[b])) {
        // @ts-expect-error - TODO: Fix these errors, seems ok for now
        modifiedInheritedStylesObj[arr[b]] = refStyle[arr[b]];
      }
    }

    if (hasParents(parent, "bullet_list")) {
      return (
        <Box key={node.key} style={styles._VIEW_SAFE_list_item}>
          <Text
            style={[modifiedInheritedStylesObj, styles.bullet_list_icon]}
            accessible={false}
            selectable
          >
            {Platform.select({
              android: "\u2022",
              ios: "\u00B7",
              default: "\u2022",
            })}
          </Text>
          <Box style={styles._VIEW_SAFE_bullet_list_content}>{children}</Box>
        </Box>
      );
    }

    if (hasParents(parent, "ordered_list")) {
      const orderedListIndex = parent.findIndex(
        (el) => el.type === "ordered_list"
      );

      const orderedList = parent[orderedListIndex];
      const listItemNumber = (
        orderedList.attributes
      )?.start
        ? Number(orderedList.attributes.start) + (node.index ?? Number.NaN)
        : (node.index ?? Number.NaN) + 1;

      return (
        <Box key={node.key} style={styles._VIEW_SAFE_list_item}>
          <Text
            style={[modifiedInheritedStylesObj, styles.ordered_list_icon]}
            selectable
          >
            {String(listItemNumber)}
            {node.markup}
          </Text>
          <Box style={styles._VIEW_SAFE_ordered_list_content}>{children}</Box>
        </Box>
      );
    }

    // we should not need this, but just in case
    return (
      <Box key={node.key} style={styles._VIEW_SAFE_list_item}>
        {children}
      </Box>
    );
  },

  // Code
  code_inline: (
    node,
    children,
    _parent,
    styles: MarkdownRuleStyles,
    inheritedStyles = {}
  ) => (
    <Text
      key={node.key}
      style={[inheritedStyles, styles.code_block]}
      selectable
    >
      {children}
    </Text>
  ),
  code_block: (
    node,
    _children,
    _parent,
    styles: MarkdownRuleStyles,
    inheritedStyles = {}
  ) => {
    // we trim new lines off the end of code blocks because the parser sends an extra one.
    let { content } = node;
    const { key } = node;

    if (typeof content === "string" && content.endsWith("\n")) {
      content = content.substring(0, content.length - 1);
    }

    return (
      <Text key={key} style={[inheritedStyles, styles.code_block]} selectable>
        {content}
      </Text>
    );
  },
  fence: (
    node,
    _children,
    _parent,
    styles: MarkdownRuleStyles,
    inheritedStyles = {}
  ) => {
    // we trim new lines off the end of code blocks because the parser sends an extra one.
    let { content } = node;
    const { key } = node;

    if (typeof content === "string" && content.endsWith("\n")) {
      content = content.substring(0, content.length - 1);
    }

    return (
      <Text key={key} style={[inheritedStyles, styles.fence]} selectable>
        {content}
      </Text>
    );
  },

  // Tables
  table: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <VStack key={node.key} style={styles._VIEW_SAFE_table}>
      {children}
    </VStack>
  ),
  thead: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <VStack key={node.key} style={styles._VIEW_SAFE_thead}>
      {children}
    </VStack>
  ),
  tbody: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <VStack key={node.key} style={styles._VIEW_SAFE_tbody}>
      {children}
    </VStack>
  ),
  th: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Row key={node.key} style={styles._VIEW_SAFE_th}>
      {children}
    </Row>
  ),
  tr: (node, children, parent, styles: MarkdownRuleStyles) => {
    const siblings = parent[0]?.children ?? [];
    if (siblings.length === 0) {
      // Should never happen, but just in case.
      // This would only occur if the node had no siblings including itself (not logical)
      return null;
    } else {
      const styleForRow =
        siblings[siblings.length - 1]?.index === node.index
          ? {
              ...styles._VIEW_SAFE_tr,
              borderBottomWidth: undefined,
              borderColor: undefined,
            }
          : styles._VIEW_SAFE_tr;

      return (
        <Row key={node.key} style={styleForRow}>
          {children}
        </Row>
      );
    }
  },
  td: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Box key={node.key} style={styles._VIEW_SAFE_td}>
      {children}
    </Box>
  ),

  // Links
  link: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Link
      key={node.key}
      style={styles._VIEW_SAFE_link}
      href={String(node.attributes?.href)}
    >
      <Text color={"blue.600"}>{children}</Text>
    </Link>
  ),
  blocklink: (
    node,
    children,
    _parent,
    styles: MarkdownRuleStyles,
    onLinkPress
  ) => (
    <Link
      key={node.key}
      onPress={() =>
        (
          openUrl as (
            url: string,
            callback?: (url: string) => boolean
          ) => undefined
        )(String(node.attributes?.href), onLinkPress)
      }
      style={styles._VIEW_SAFE_blocklink}
    >
      <Box style={styles.image}>{children}</Box>
    </Link>
  ),

  // Images
  image: (
    node,
    _children,
    _parent,
    styles: MarkdownRuleStyles,
    allowedImageHandlers,
    defaultImageHandler: string | null | undefined
  ) => (
    <CustomImageRenderer
      key={node.key}
      node={node}
      styles={styles}
      allowedImageHandlers={allowedImageHandlers}
      defaultImageHandler={defaultImageHandler}
    />
  ),

  // Text Output
  text: (
    node,
    _children,
    _parent,
    styles: MarkdownRuleStyles,
    inheritedStyles = {}
  ) => (
    <Text key={node.key} style={[inheritedStyles, styles.text]} selectable>
      {node.content}
    </Text>
  ),
  textgroup: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Text key={node.key} style={styles.textgroup} selectable>
      {children}
    </Text>
  ),
  paragraph: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Box key={node.key} style={styles._VIEW_SAFE_paragraph}>
      {children}
    </Box>
  ),
  hardbreak: (node, _children, _parent, styles: MarkdownRuleStyles) => (
    <Text key={node.key} style={styles.hardbreak} selectable>
      {"\n"}
    </Text>
  ),
  softbreak: (node, _children, _parent, styles: MarkdownRuleStyles) => (
    <Text key={node.key} style={styles.softbreak} selectable>
      {"\n"}
    </Text>
  ),

  // Believe these are never used but retained for completeness
  pre: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Box key={node.key} style={styles._VIEW_SAFE_pre}>
      {children}
    </Box>
  ),
  inline: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Text key={node.key} style={styles.inline} selectable>
      {children}
    </Text>
  ),
  span: (node, children, _parent, styles: MarkdownRuleStyles) => (
    <Text key={node.key} style={styles.span} selectable>
      {children}
    </Text>
  ),

  // @ts-expect-error - this is fine
  html_inline: ({ content, key }: { content: string; key: React.Key }) => {
    if (content === "<br>" || content === "<br/>" || content === "<br />") {
      return <Text key={key}>{"\n"}</Text>;
    }
    return null;
  },
} as const;
