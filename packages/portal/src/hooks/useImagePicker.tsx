import { Modal } from "antd";
import type { ReactElement } from "react";
import { useCallback, useState } from "react";

import { ImagePicker } from "@/elements/components/image/ImagePicker.js";

export function useImagePicker() {
  const [queue, setQueue] = useState<ReactElement[]>([]);

  const openPicker = useCallback(
    (
      onSelect: (
        imageUuid: string,
        imageUrl: string | URL | null | undefined
      ) => void
    ) => {
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
            onSelect={(imageUuid, imageUrl) => {
              onSelect(imageUuid, imageUrl);
              setQueue((prev) => prev.slice(0, -1));
            }}
          />
        </Modal>
      );

      setQueue((prev) => [...prev, component]);
    },
    []
  );

  return { openPicker, renderMe: queue[queue.length - 1] };
}
