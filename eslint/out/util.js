export function extractPluginRules(plugin, ruleSet) {
    if (plugin.configs == null) {
        return undefined;
    }
    const config = plugin.configs[ruleSet];
    if (config == null) {
        return undefined;
    }
    else if (Array.isArray(config)) {
        return config.reduce((acc, singleConfig) => {
            return { ...acc, ...singleConfig.rules };
        }, {});
    }
    else {
        return config.rules;
    }
}
