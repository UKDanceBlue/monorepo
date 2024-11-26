/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  entryPoints: ["./packages/*"],
  entryPointStrategy: "packages",
  out: "doc",
  plugin: [
    "typedoc-plugin-zod",
    "typedoc-plugin-missing-exports",
    "typedoc-plugin-dt-links",
    "typedoc-plugin-mdn-links",
  ],
  packageOptions: {
    blockTags: ["@link", "@alias", "@descEN"],
    excludeTags: ["@descCN"],
  },
};

export default config;
