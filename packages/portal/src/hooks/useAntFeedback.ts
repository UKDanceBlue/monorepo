import { App } from "antd";
import type { ModalFunc } from "antd/es/modal/confirm";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";

export const useAntFeedback = () => {
  const { message, notification, modal } = App.useApp();

  return {
    showErrorMessage: message.error,
    showWarningMessage: message.warning,
    showSuccessMessage: message.success,
    showLoadingMessage: message.loading,
    showInfoMessage: message.info,
    showErrorNotification: notification.error,
    showWarningNotification: notification.warning,
    showSuccessNotification: notification.success,
    showInfoNotification: notification.info,
    showErrorModal: modal.error,
    showWarningModal: modal.warning,
    showSuccessModal: modal.success,
    showInfoModal: modal.info,
    showConfirmModal: modal.confirm,
    appMessage: message,
    appNotification: notification,
    appModal: modal,
  };
};

export const useAskConfirm = ({
  modalTitle = "Confirm",
  modalContent,
  onOk,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
}: {
  modalTitle?: string;
  modalContent: ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
}): {
  openConfirmModal: () => void;
  closeConfirmModal: () => void;
} => {
  const { showConfirmModal } = useAntFeedback();
  const [activeModal, setActiveModal] = useState<
    ReturnType<ModalFunc> | undefined
  >(undefined);

  const openConfirmModal = useCallback(() => {
    setActiveModal(
      showConfirmModal({
        title: modalTitle,
        content: modalContent,
        onOk: () => {
          onOk?.();
        },
        onCancel: () => {
          onCancel?.();
        },
        afterClose: () => {
          setActiveModal(undefined);
        },
        okText,
        cancelText,
        okButtonProps: {
          danger: true,
        },
      })
    );
  }, [
    showConfirmModal,
    modalTitle,
    modalContent,
    onOk,
    onCancel,
    okText,
    cancelText,
  ]);

  return { openConfirmModal, closeConfirmModal: () => activeModal?.destroy() };
};
