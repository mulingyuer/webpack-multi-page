/*
 * @Author: mulingyuer
 * @Date: 2021-10-27 11:04:11
 * @LastEditTime: 2021-10-28 11:35:53
 * @LastEditors: mulingyuer
 * @Description:webpack配置
 * @FilePath: \undp-web\webpack.config.js
 * 怎么可能会有bug！！！
 */
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack/webpack.base");
const devConfig = require("./webpack/webpack.dev");
const prodConfig = require("./webpack/webpack.prod");

module.exports = (env, argv) => {
  const isDev = !!env.development;
  const isProd = !!env.production;

  if (isDev) {
    return merge(baseConfig, devConfig);
  } else if (isProd) {
    return merge(baseConfig, prodConfig);
  } else {
    return baseConfig;
  }
}