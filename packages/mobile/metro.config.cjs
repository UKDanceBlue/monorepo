// Learn more https://docs.expo.io/guides/customizing-metro
// @ts-expect-error - CommonJS
const { withSentryConfig } = require("@sentry/react-native/metro");
// @ts-expect-error - CommonJS
const { getDefaultConfig } = require("expo/metro-config");
// @ts-expect-error - CommonJS
// eslint-disable-next-line @typescript-eslint/unbound-method
const { resolve } = require("node:path");

// Find the project and workspace directories
const projectRoot = __dirname;

/** @type {import("metro-resolver").CustomResolver} */
const resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "type-graphql") {
    return context.resolveRequest(context, "type-graphql/shim", platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

/** @return {import("expo/metro-config").MetroConfig} */
const config = () => {
  /** @type {import("expo/metro-config").MetroConfig}*/
  // @ts-expect-error - This is fine
  const config = getDefaultConfig(projectRoot);

  // @ts-expect-error - This is fine
  return withSentryConfig({
    ...config,
    resolver: {
      ...config.resolver,
      resolveRequest,
      unstable_enablePackageExports: true,
    },
    projectRoot,
    watchFolders: [projectRoot, resolve(projectRoot, "..", "..")],
  });
};

module.exports = config();
