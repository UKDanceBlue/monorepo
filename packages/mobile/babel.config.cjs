/**
 *
 * @returns {import('@babel/core').TransformOptions}
 */
module.exports = function babel() {
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
