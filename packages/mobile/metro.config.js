// Learn more https://docs.expo.io/guides/customizing-metro
const path = require("node:path");

const { getDefaultConfig } = require("expo/metro-config");

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, "../..");

/** @return {import("expo/metro-config").MetroConfig} */
async function config() {
  /** @type {import("expo/metro-config").MetroConfig}*/
  const config = await getDefaultConfig(projectRoot);

  // 1. Watch all files within the monorepo
  config.watchFolders = [workspaceRoot];
  // 2. Let Metro know where to resolve packages and in what order
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ];

  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === "type-graphql") {
      return {
        filePath:
          "../common/node_modules/type-graphql/build/cjs/browser-shim.js",
        type: "sourceFile",
      };
    }
    return context.resolveRequest(context, moduleName, platform);
  };
  config.transformer.getTransformOptions = async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  });

  return config;
}

module.exports = config();
