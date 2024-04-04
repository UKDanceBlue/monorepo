import { ImagePicker } from "@elements/components/ImagePicker";
import { Modal } from "antd";
import { useCallback, useState } from "react";

export function useImagePicker() {
  const [queue, setQueue] = useState<JSX.Element[]>([]);

  const openPicker = useCallback((onSelect: (imageUuid: string) => void) => {
    const component = (
      <Modal
        title="Select an image"
        open
        onCancel={() => {
          setQueue((prev) => prev.slice(0, -1));
        }}
        footer={null}
      >
        <ImagePicker
          onSelect={(imageUuid) => {
            onSelect(imageUuid);
            setQueue((prev) => prev.slice(0, -1));
          }}
        />
      </Modal>
    );

    setQueue((prev) => [...prev, component]);
  }, []);

  return { openPicker, renderMe: queue[queue.length - 1] };
}
