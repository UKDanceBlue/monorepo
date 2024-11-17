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

type ErrorWithCause = Error & { cause?: unknown };

function ErrorBoundaryFallback({
  componentStack,
  error,
  isComponentError,
  untypedError,
}: {
  error?: ErrorWithCause | undefined | null;
  untypedError?: unknown;
  componentStack?: string | undefined | null;
  isComponentError?: boolean | undefined | null;
}) {
  let stringifiedError = "";
  try {
    stringifiedError =
      typeof untypedError === "object"
        ? JSON.stringify(untypedError, null, 2)
        : String(untypedError);
  } catch {
    stringifiedError = String(untypedError);
  }

  if (error) {
    return (
      <SafeAreaView>
        <ScrollView>
          <Text
            style={{ fontSize: 20, marginBottom: 15, fontWeight: "bold" }}
          >{`Something went wrong: ${error.name} - ${error.message}`}</Text>
          <Text style={{ marginBottom: 15 }}>
            An error occurred in
            {isComponentError ? " a component. " : " the app. "}
            This is likely a bug and will require you to restart the app.
          </Text>
          <Button
            title={"Send Report"}
            onPress={() => {
              // Send an email
              openURL(
                `mailto:app@danceblue.org?subject=Bug%20Report&body=${encodeURIComponent(
                  `
Error: ${error.name} - ${error.message} (${error.stack ?? ""})
--------------------
Component Stack: ${componentStack ?? ""}
--------------------
Error Info: ${stringifiedError}
`
                )}`
              ).catch(universalCatch);
            }}
          />
          {error.cause ? (
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
          <Text style={{ marginBottom: 15 }}>{error.stack}</Text>
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
          <Text style={{ marginBottom: 15 }}>{String(untypedError)}</Text>
          <Text style={{ marginBottom: 15 }}>{stringifiedError}</Text>
          <Text style={{ marginBottom: 15 }}>{componentStack}</Text>
        </View>
      </SafeAreaView>
    );
  }
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
