module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["module-resolver",], "@babel/plugin-proposal-export-namespace-from","react-native-reanimated/plugin"
    ],
  };
};
