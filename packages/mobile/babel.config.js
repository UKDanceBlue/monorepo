module.exports = function (api) {
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
            "@assets": "./assets",
            "@common": "./src/common",
            "@context": "./src/context",
            "@navigation": "./src/navigation",
            "@theme": "./src/theme",
            "@types": "./src/types",
            "type-graphql": "type-graphql/build/cjs/browser-shim.js",
          },
        },
      ],
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
    ],
  };
};
