import { createContext } from "react";

interface FeedbackContextType {
  showToast: (message: string) => void;
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
  showAlertDialog: (message: string) => void;
  showConfirmDialog: (message: string, onConfirm: () => void) => void;
  showPromptDialog: (
    message: string,
    onConfirm: (input: string) => void
  ) => void;
}

export const feedbackContext = createContext<FeedbackContextType>({
  showToast: () => undefined,
  showSuccessToast: () => undefined,
  showErrorToast: () => undefined,
  showAlertDialog: () => undefined,
  showConfirmDialog: () => undefined,
  showPromptDialog: () => undefined,
});
