/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  entryPoints: ["./src/lib", "./src/repositories", "./src/resolvers"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
};

export default config;
