// Learn more https://docs.expo.io/guides/customizing-metro
const fs = require("node:fs");
const path = require("node:path");

const { getDefaultConfig } = require("expo/metro-config");

// Find the project and workspace directories
const projectRoot = __dirname;

const workspaces = fs.readdirSync(path.resolve(__dirname, "../"));
const currentWorkspace = path.basename(__dirname);

/** @return {import("expo/metro-config").MetroConfig} */
async function config() {
  /** @type {import("expo/metro-config").DefaultConfigOptions} */
  const expoMetroConfig = await getDefaultConfig(projectRoot);

  /** @type {import("expo/metro-config").MetroConfig}*/
  const config = {
    ...expoMetroConfig,
    projectRoot,
    watchFolders: workspaces
      .filter((f) => f !== currentWorkspace)
      .map((f) => path.join(projectRoot, "../", f)),
    resolver: {
      ...expoMetroConfig.resolver,
      extraNodeModules: new Proxy(
        {},
        {
          get: (target, name) => path.join(projectRoot, `node_modules/${name}`),
        }
      ),
      // Alias type-graphql to the browser shim
      resolveRequest: (context, moduleName, platform) => {
        if (moduleName === "type-graphql") {
          return {
            filePath:
              "../common/node_modules/type-graphql/build/cjs/browser-shim.js",
            type: "sourceFile",
          };
        }
        return context.resolveRequest(context, moduleName, platform);
      },
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
  };

  return config;
}

module.exports = config();
