import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

import { Text, TextClassContext } from "~/components/ui/text";
import { cn } from "~/lib/utils";

import { buttonTextVariants, buttonVariants } from "./buttonVariants";

type ButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof Pressable> &
    VariantProps<typeof buttonVariants>,
  "children"
> & {
  loading?: boolean;
  prefix?: React.ReactNode;
  children: React.ReactNode;
  suffix?: React.ReactNode;
};

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      prefix,
      suffix,
      children,
      ...props
    },
    ref
  ) => {
    const prefixNode = prefix ? <View className="mx-2">{prefix}</View> : null;
    const childNode =
      typeof children === "string" ? <Text>{children}</Text> : children;
    const suffixNode = loading ? (
      <ActivityIndicator size="small" color="white" />
    ) : suffix ? (
      <View className="mx-2">{suffix}</View>
    ) : null;

    return (
      <TextClassContext.Provider
        value={buttonTextVariants({
          variant,
          size,
          className: "web:pointer-events-none",
        })}
      >
        <Pressable
          className={cn(
            props.disabled && "opacity-50 web:pointer-events-none",
            buttonVariants({ variant, size, className })
          )}
          ref={ref}
          role="button"
          {...props}
        >
          <View className="flex flex-row justify-center gap-4 w-full h-full">
            {prefixNode}
            {childNode}
            {suffixNode}
          </View>
        </Pressable>
      </TextClassContext.Provider>
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
