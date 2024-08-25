/**
 *
 * @param {import('@babel/core').ConfigAPI} api
 * @returns {import('@babel/core').TransformOptions}
 */
module.exports = function babel(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [
            ".ios.js",
            ".android.js",
            ".js",
            ".ts",
            ".tsx",
            ".json",
            ".png",
            ".jpg",
            ".ttf",
          ],
          alias: {
            "type-graphql": "./node_modules/type-graphql/build/cjs/shim.js",
          },
        },
      ],
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
    ],
  };
};
