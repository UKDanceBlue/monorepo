// Learn more https://docs.expo.io/guides/cus tomizing-metro
// @ts-expect-error - CommonJS
const { withSentryConfig } = require("@sentry/react-native/metro");
// @ts-expect-error - CommonJS
const { getDefaultConfig } = require("expo/metro-config");
// @ts-expect-error - CommonJS
const { mergeConfig } = require("metro-config");

// Find the project and workspace directories
const projectRoot = __dirname;

const config = withSentryConfig(getDefaultConfig(projectRoot));

/** @type {Partial<Record<string, string>>} */
const ALIASES = {
  "type-graphql": "type-graphql/shim",
};

// @ts-expect-error - It is defined by expo/metro-config
config.resolver /*
Only ignore the first bit
 */.resolveRequest =
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

// @ts-expect-error - It is defined by expo/metro-config
config.resolver /*
Only ignore the first bit
 */.unstable_enablePackageExports = true;

module.exports = config;
