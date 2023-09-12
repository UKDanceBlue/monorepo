import Markdown, { MarkdownIt, MarkdownProps } from "@jonasmerlin/react-native-markdown-display";
import { canOpenURL, openURL } from "expo-linking";

import { log } from "../../logging";
import { rules as defaultRules } from "../../markdownRules";

const NativeBaseMarkdown = ({
  children,
  debugPrintTree,
  mergeStyle,
  onLinkPress,
  renderer,
  rules,
  style,
}: Omit<MarkdownProps, "markdownit">) => {
  // TODO use nativebase theme to replace the colors that are hardcoded in the default rules
  return (<Markdown
    debugPrintTree={debugPrintTree}
    mergeStyle={mergeStyle}
    onLinkPress={
      onLinkPress ??
      ((url) => {
        canOpenURL(url)
          .then((canOpen) => canOpen ? openURL(url) : null)
          .catch((e) => {
            log(`Failed to open URL ${url}: ${JSON.stringify(e)}`, "error");
          });
        return false;
      })
    }
    renderer={renderer}
    rules={rules ?? defaultRules}
    style={style}
    markdownit={
      // This is caused by using a reexport
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      MarkdownIt({ linkify: true, typographer: true, html: true })
    }
  >
    {children}
  </Markdown>);
};

export default NativeBaseMarkdown;
