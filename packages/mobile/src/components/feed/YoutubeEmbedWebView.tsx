import type { WebViewProps } from "react-native-webview";
import WebView from "react-native-webview";

export function YoutubeEmbedWebView({
  source,
  onErrorEmitted,
  ...props
}: WebViewProps & { onErrorEmitted: () => void }) {
  return (
    <WebView
      source={source}
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
