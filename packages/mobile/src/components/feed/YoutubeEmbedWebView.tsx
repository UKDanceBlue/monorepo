import { Platform } from "react-native";
import type { WebViewProps } from "react-native-webview";
import WebView from "react-native-webview";

export function YoutubeEmbedWebView({
  source,
  onErrorEmitted,
  ...props
}: WebViewProps & { onErrorEmitted: () => void } & {
  youtubeId: string;
}) {
  if (Platform.OS === "web") {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${props.youtubeId}?playsinline=1`}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }

  return (
    <WebView
      source={{
        uri: `https://www.youtube.com/embed/${props.youtubeId}?playsinline=1`,
      }}
      {...props}
      onMessage={(e) => {
        if (e.nativeEvent.data === "error") {
          onErrorEmitted();
        }
      }}
      // Watch to see if any elements matching .ytp-error are visible
      injectedJavaScript={`
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1 && node.matches(".ytp-error")) {
                window.ReactNativeWebView.postMessage("error");
              }
            });
          });
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      `}
    />
  );
}
