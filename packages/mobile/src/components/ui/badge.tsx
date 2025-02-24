import * as Slot from "@rn-primitives/slot";
import type { SlottableViewProps } from "@rn-primitives/types";
import { type VariantProps } from "class-variance-authority";
import { View } from "react-native";

import { TextClassContext } from "~/components/ui/text";
import { cn } from "~/lib/utils";

import { badgeTextVariants, badgeVariants } from "./badgeVariants";

type BadgeProps = SlottableViewProps & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Component = asChild ? Slot.View : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Badge };
export type { BadgeProps };
