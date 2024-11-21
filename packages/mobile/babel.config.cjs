/**
 * @param {import('@babel/core').ConfigAPI} api
 * @returns {import('@babel/core').TransformOptions}
 */
module.exports = function babel(api) {
  api.cache.forever();

  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
