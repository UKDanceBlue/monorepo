import { OptionDefaults } from "typedoc";

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
    blockTags: [...OptionDefaults.blockTags, "@link", "@alias", "@descEN"],
    excludeTags: ["@descCN"],
    skipErrorChecking: true,
    navigationLeaves: ["common", "mobile", "portal", "server"],
  },
};

export default config;
