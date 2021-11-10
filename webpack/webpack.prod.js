/*
 * @Author: mulingyuer
 * @Date: 2021-10-28 11:03:53
 * @LastEditTime: 2021-11-10 14:31:47
 * @LastEditors: mulingyuer
 * @Description: webpack生产配置
 * @FilePath: \webpack-multi-page\webpack\webpack.prod.js
 * 怎么可能会有bug！！！
 */
const CompressionPlugin = require("compression-webpack-plugin"); //压缩

module.exports = {
  //模式
  mode: "production",
  //开发工具
  devtool: "nosources-source-map",
  //插件
  plugins: [
    //gzip
    new CompressionPlugin({
      algorithm: "gzip", //压缩算法，默认gzip
      test: /\.(js|css)(\?.*)?$/i, //指定什么文件进行压缩
      threshold: 10240, //大于10kb就压，默认0kb
      // minRatio: 0.8, //压缩比 默认0.8
      // deleteOriginalAssets: false, //是否删除压缩的源文件  ，默认false
    })
  ]
}
