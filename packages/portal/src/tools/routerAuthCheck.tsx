import { getLoginState } from "@hooks/useLoginState";
import { redirect } from "@tanstack/react-router";
import type { AuthorizationRule } from "@ukdanceblue/common";
import {
  checkAuthorization,
  prettyPrintAuthorizationRule,
} from "@ukdanceblue/common";
import type { useAppProps } from "antd/es/app/context";
import type { Client } from "urql";

export function routerAuthCheck(
  route: {
    options: {
      staticData: {
        authorizationRules: AuthorizationRule[] | null;
      };
    };
  },
  context: { urqlClient: Client; antApp: useAppProps }
) {
  const { authorizationRules } = route.options.staticData;
  const { authorization } = getLoginState(context.urqlClient);
  if (!authorization) {
    // Authorization is not yet loaded, so we can't check it yet.
    return;
  }
  if (
    authorizationRules &&
    !authorizationRules.some((rule) => checkAuthorization(rule, authorization))
  ) {
    const message = authorizationRules.map((rule) => (
      <li>{prettyPrintAuthorizationRule(rule)}</li>
    ));
    context.antApp.notification.error({
      message: "Unauthorized",
      description: (
        <>
          <p>
            You are not authorized to view this page. One of the following rules
            must be met:
          </p>
          <ul>{message}</ul>
        </>
      ),
    });
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: "/" });
  }
}
