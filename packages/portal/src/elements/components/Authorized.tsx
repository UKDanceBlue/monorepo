import type { Action, Subject, SubjectObject } from "@ukdanceblue/common";
import { Result } from "antd";
import type { PropsWithChildren } from "react";

import { useAuthorizationRequirement } from "#hooks/useLoginState.js";

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
    return showError ? <Result status="403" title="Unauthorized" /> : null;
  }

  return children;
}
