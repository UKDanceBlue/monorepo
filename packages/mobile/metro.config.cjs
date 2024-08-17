// Learn more https://docs.expo.io/guides/customizing-metro
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const path = require("node:path");

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, "../..");

/** @type {import("metro-resolver").CustomResolver} */
const resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "type-graphql") {
    return {
      filePath: "../common/node_modules/type-graphql/build/cjs/browser-shim.js",
      type: "sourceFile",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

/** @return {import("expo/metro-config").MetroConfig} */
function config() {
  /** @type {import("expo/metro-config").MetroConfig}*/
  const config = getSentryExpoConfig(projectRoot);

  // 1. Watch all files within the monorepo
  config.watchFolders = [workspaceRoot];
  // 2. Let Metro know where to resolve packages and in what order
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ];

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
}

module.exports = config();
