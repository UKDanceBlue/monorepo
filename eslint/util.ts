import type eslintPluginTypescript from "@typescript-eslint/eslint-plugin";
import type { ESLint, Linter } from "eslint";

export function extractPluginRules(
  plugin: ESLint.Plugin | typeof eslintPluginTypescript,
  ruleSet: string
): Partial<Linter.RulesRecord> | undefined {
  if (plugin.configs == null) {
    return undefined;
  }
  const config = plugin.configs[ruleSet];
  if (config == null) {
    return undefined;
  } else if (Array.isArray(config)) {
    return config.reduce<Linter.RulesRecord>((acc, singleConfig) => {
      return { ...acc, ...singleConfig.rules };
    }, {});
  } else {
    return config.rules;
  }
}
