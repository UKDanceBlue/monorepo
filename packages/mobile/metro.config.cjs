// Learn more https://docs.expo.io/guides/customizing-metro
const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { getDefaultConfig } = require("expo/metro-config");

// Find the project and workspace directories
const projectRoot = __dirname;

/** @return {import("expo/metro-config").MetroConfig} */
const config = () => {
  /** @type {import("expo/metro-config").MetroConfig}*/
  const config = getSentryExpoConfig(projectRoot, { getDefaultConfig });

  const oldResolver = config.resolver.resolveRequest;
  /** @type {import("metro-resolver").CustomResolver} */
  const resolveRequest = (context, moduleName, platform) => {
    if (moduleName === "type-graphql") {
      return context.resolveRequest(context, "type-graphql/shim", platform);
    }
    return oldResolver(context, moduleName, platform);
  };
  config.resolver.resolveRequest = resolveRequest;
  config.transformer.getTransformOptions = () =>
    Promise.resolve({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    });

  config.resolver.unstable_enablePackageExports = true;

  return config;
};

module.exports = config();
