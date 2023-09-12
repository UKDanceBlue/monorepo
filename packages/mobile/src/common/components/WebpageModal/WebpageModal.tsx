import { Center, Modal, Spinner } from "native-base";
import { useWindowDimensions } from "react-native";
import WebView from "react-native-webview";
import { WebViewSource } from "react-native-webview/lib/WebViewTypes";

export default function WebpageModal({
  isOpen, onClose, source
}: { isOpen: boolean; onClose: () => void; source: WebViewSource | null }) {
  const { height } = useWindowDimensions();

  return (<Modal
    isOpen={isOpen}
    onClose={onClose}
    justifyContent="center"
    size="full"
    p={4}>
    {source != null && (<Modal.Content>
      <Modal.Body p={0}>
        <WebView
          source={source}
          style={{
            width: "100%",
            height,
          }}
          startInLoadingState
          renderLoading={() => (<Center><Spinner size="lg" /></Center>)}
          mixedContentMode="compatibility"
          sharedCookiesEnabled
        />
      </Modal.Body>
    </Modal.Content>)}
  </Modal>);
}
