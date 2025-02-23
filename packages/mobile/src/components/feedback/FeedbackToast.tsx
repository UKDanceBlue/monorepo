import * as ToastPrimitive from "@rn-primitives/toast";

export function FeedbackToast({
  text,
  color,
}: {
  text: string;
  color: string;
}) {
  return (
    <ToastPrimitive.Root
      open
      onOpenChange={() => undefined}
      className="opacity-95 border-border flex-row justify-between items-center p-4 rounded-xl"
      style={{ backgroundColor: color }}
    >
      <ToastPrimitive.Title>{text}</ToastPrimitive.Title>
    </ToastPrimitive.Root>
  );
}
