/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  entryPoints: ["./src/common", "./src/context"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
};

export default config;
