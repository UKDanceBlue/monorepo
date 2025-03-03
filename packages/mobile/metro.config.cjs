// Learn more https://docs.expo.io/guides/cus tomizing-metro
const { withSentryConfig } = require("@sentry/react-native/metro");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Find the project and workspace directories
// eslint-disable-next-line no-undef
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

/** @type {Partial<Record<string, string>>} */
const ALIASES = {
  "type-graphql": "type-graphql/shim",
};

config.resolver.resolveRequest =
  /** @type {import("metro-resolver").CustomResolver} */
  (context, moduleName, platform) => {
    // Ensure you call the default resolver.
    return context.resolveRequest(
      context,
      // Use an alias if one exists.
      ALIASES[moduleName] ?? moduleName,
      platform
    );
  };

config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ["require", "react-native"];

module.exports = withNativeWind(
  withSentryConfig(config, {
    annotateReactComponents: true,
  }),
  {
    input: "./src/global.css",
  }
);
