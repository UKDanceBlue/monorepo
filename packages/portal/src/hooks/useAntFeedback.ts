import { App } from "antd";
import type { ModalFunc } from "antd/es/modal/confirm.js";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import { handleUnknownError } from "#tools/apolloErrorHandler.js";

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

export const useAskConfirm = <T = undefined>({
  modalTitle = "Confirm",
  modalContent,
  onOk,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
}: {
  modalTitle?: string;
  modalContent: ReactNode;
  onOk?: T extends undefined
    ? () => void | Promise<void>
    : (arg: T) => void | Promise<void>;
  onCancel?: T extends undefined
    ? () => void | Promise<void>
    : (arg: T) => void | Promise<void>;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
}): {
  openConfirmModal: (arg: T) => Promise<void>;
  closeConfirmModal: () => void;
} => {
  const { showConfirmModal } = useAntFeedback();
  const [activeModal, setActiveModal] = useState<
    ReturnType<ModalFunc> | undefined
  >(undefined);

  const openConfirmModal = useCallback(
    (arg: T) => {
      return new Promise<void>((resolve, reject) => {
        setActiveModal(
          showConfirmModal({
            title: modalTitle,
            content: modalContent,
            onOk: async () => {
              try {
                await onOk?.(arg);
              } catch (error) {
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                reject(error);
              }
              resolve();
            },
            onCancel: async () => {
              try {
                await onCancel?.(arg);
              } catch (error) {
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                reject(error);
              }
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
              reject("cancel");
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
      });
    },
    [
      showConfirmModal,
      modalTitle,
      modalContent,
      onOk,
      onCancel,
      okText,
      cancelText,
    ]
  );

  return { openConfirmModal, closeConfirmModal: () => activeModal?.destroy() };
};

export const useUnknownErrorHandler = (): {
  showErrorMessage: (error: unknown) => void;
  showErrorNotification: (error: unknown) => void;
  showErrorModal: (error: unknown) => void;
} => {
  const { showErrorMessage, showErrorNotification, showErrorModal } =
    useAntFeedback();

  return {
    showErrorMessage: useCallback(
      (error: unknown) =>
        handleUnknownError(error, { message: showErrorMessage }),
      [showErrorMessage]
    ),
    showErrorNotification: useCallback(
      (error: unknown) =>
        handleUnknownError(error, { notification: showErrorNotification }),
      [showErrorNotification]
    ),
    showErrorModal: useCallback(
      (error: unknown) => handleUnknownError(error, { modal: showErrorModal }),
      [showErrorModal]
    ),
  };
};
