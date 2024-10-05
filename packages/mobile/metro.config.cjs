// Learn more https://docs.expo.io/guides/customizing-metro
const { withSentryConfig } = require("@sentry/react-native/metro");
const { getDefaultConfig } = require("expo/metro-config");

// Find the project and workspace directories
const projectRoot = __dirname;

/** @type {import("metro-resolver").CustomResolver} */
const resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "type-graphql") {
    return context.resolveRequest(context, "type-graphql/shim", platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

const getTransformOptions = () =>
  Promise.resolve({
    transform: {
      experimentalImportSupport: true,
      inlineRequires: true,
    },
  });

/** @return {import("expo/metro-config").MetroConfig} */
const config = () => {
  /** @type {import("expo/metro-config").MetroConfig}*/
  const config = getDefaultConfig(projectRoot);

  return withSentryConfig({
    ...config,
    resolver: {
      ...config.resolver,
      resolveRequest,
      unstable_enablePackageExports: true,
    },
    transformer: {
      ...config.transformer,
      getTransformOptions,
    },
  });
};

module.exports = config();
