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
      extraNodeModules: new Proxy(
        {},
        {
          get: (target, name) => path.join(projectRoot, `node_modules/${name}`),
        }
      ),
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
