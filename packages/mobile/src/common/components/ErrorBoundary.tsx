import type { ErrorBoundaryProps } from "@sentry/react";
import {
  ErrorBoundary as SentryErrorBoundary,
  withErrorBoundary as withSentryErrorBoundary,
} from "@sentry/react-native";
import { debugStringify } from "@ukdanceblue/common";
import { openURL } from "expo-linking";
import type { ReactNode } from "react";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";

import { universalCatch } from "../logging";

function ErrorBoundaryFallback({
  componentStack,
  error,
  isComponentError,
}: {
  error?: unknown;
  componentStack?: string | undefined | null;
  isComponentError?: boolean | undefined | null;
}) {
  const stringifiedError = debugStringify(error);

  if (error) {
    return (
      <SafeAreaView>
        <ScrollView>
          <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: "bold" }}>
            {error instanceof Error
              ? `Something went wrong: ${error.name} - ${error.message}`
              : "Something went wrong"}
          </Text>
          <Text style={{ marginBottom: 15 }}>
            An error occurred in
            {isComponentError ? " a component. " : " the app. "}
            This is likely a bug and will require you to restart the app.
          </Text>
          <Button
            title={"Send Report"}
            onPress={() =>
              sendEmail(error, componentStack, stringifiedError).catch(
                universalCatch
              )
            }
          />
          {typeof error === "object" && "cause" in error ? (
            <>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Error Cause:
              </Text>
              <Text style={{ marginBottom: 15 }}>
                {debugStringify(error.cause)}
              </Text>
            </>
          ) : null}
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>JS stack:</Text>
          {typeof error === "object" && "stack" in error && (
            <Text style={{ marginBottom: 15 }}>{String(error.stack)}</Text>
          )}
          {componentStack && (
            <>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Component stack:
              </Text>
              <Text style={{ marginBottom: 15 }}>{componentStack}</Text>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView>
        <View>
          <Text style={{ fontSize: 20, marginBottom: 15 }}>
            Something went wrong
          </Text>
          <Text style={{ marginBottom: 15 }}>
            An error occurred in the app. This is likely a bug in the app.
          </Text>
          <Text style={{ marginBottom: 15 }}>{stringifiedError}</Text>
          <Text style={{ marginBottom: 15 }}>{componentStack}</Text>
        </View>
      </SafeAreaView>
    );
  }
}

async function sendEmail(
  error: unknown,
  componentStack: string | null | undefined,
  stringifiedError: string
) {
  // Send an email
  return openURL(
    `mailto:app@danceblue.org?subject=Bug%20Report&body=${
      error instanceof Error
        ? encodeURIComponent(
            `
Error: ${error.name} - ${error.message} (${error.stack ?? ""})
--------------------
Component Stack: ${componentStack ?? ""}
--------------------
Error Info: ${stringifiedError}
`
          )
        : encodeURIComponent(
            `
Error: ${stringifiedError}
--------------------
Component Stack: ${componentStack ?? ""}
`
          )
    }`
  );
}

function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <SentryErrorBoundary fallback={ErrorBoundaryFallback}>
      {children}
    </SentryErrorBoundary>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function withErrorBoundary<P extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryOptions?: ErrorBoundaryProps
): React.FC<P> {
  return withSentryErrorBoundary(WrappedComponent, {
    ...errorBoundaryOptions,
    fallback: ErrorBoundaryFallback,
  });
}

export default ErrorBoundary;
