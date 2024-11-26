/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  entryPoints: ["./src/config", "./src/elements", "./src/hooks", "./src/tools"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  exclude: ["src/routeTree.gen.ts", "src/routes"],
};

export default config;
