import { openURL } from "expo-linking";
import type { ReactNode } from "react";
import { Component } from "react";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";

import { logError, universalCatch } from "../logging";

type ErrorWithCause = Error & { cause?: unknown };

class ErrorBoundary extends Component<
  { children: ReactNode },
  {
    error?: ErrorWithCause | null;
    untypedError?: unknown;
    componentStack?: string | null;
    isComponentError?: boolean | null;
  }
> {
  constructor(
    props: { children: ReactNode } | Readonly<{ children: ReactNode }>
  ) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error: unknown) {
    if (error instanceof Error) {
      logError(error);
    }

    return { error };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    this.setState({
      error: error instanceof Error ? error : null,
      untypedError: error,
    });

    if (
      typeof errorInfo === "object" &&
      errorInfo &&
      Object.hasOwn(errorInfo, "componentStack")
    ) {
      this.setState({
        componentStack: String(
          (errorInfo as { componentStack: unknown }).componentStack
        ),
      });
    } else if (
      typeof error === "object" &&
      error &&
      Object.hasOwn(error, "componentStack")
    ) {
      this.setState({
        componentStack: String(
          (error as { componentStack: unknown }).componentStack
        ),
      });
    }

    if (
      typeof error === "object" &&
      error &&
      Object.hasOwn(error, "isComponentError")
    ) {
      this.setState({
        isComponentError: Boolean(
          (error as { isComponentError: unknown }).isComponentError
        ),
      });
    }
  }

  render() {
    const { error, untypedError, componentStack, isComponentError } =
      this.state;

    let stringifiedError = "";
    try {
      stringifiedError = JSON.stringify(untypedError, null, 2);
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
              {isComponentError
                ? "An error occurred in a component. This is likely a bug in the app."
                : "An error occurred in the app. This is likely a bug in the app."}
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
                  {error.cause instanceof Error
                    ? error.cause.message
                    : String(error.cause)}
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
    } else if (untypedError) {
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
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
