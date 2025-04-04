import {
  type Action,
  debugStringify,
  type Subject,
  type SubjectObject,
} from "@ukdanceblue/common";
import type { PropsWithChildren } from "react";

import { useAuthorizationRequirement } from "~/lib/hooks/useLoginState";

import { Text } from "../ui/text";

export function Authorized<S extends Exclude<Subject, "all">>({
  children,
  action,
  field,
  subject,
  showError = false,
}: PropsWithChildren<{
  action: Action;
  subject: S | "all";
  field?:
    | keyof Pick<
        SubjectObject<S extends string ? S : Exclude<S, string>["kind"]>,
        `.${string}` &
          keyof SubjectObject<S extends string ? S : Exclude<S, string>["kind"]>
      >
    | ".";
  showError?: boolean;
}>) {
  const can = useAuthorizationRequirement(action, subject, field);

  if (!can) {
    return showError ? (
      <Text className="text-center">
        Authorized to {action} {debugStringify(subject)} denied
      </Text>
    ) : null;
  }

  return <>{children}</>;
}
