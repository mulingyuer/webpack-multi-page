/*
 * @Author: mulingyuer
 * @Date: 2021-10-28 11:42:51
 * @LastEditTime: 2021-10-28 14:42:13
 * @LastEditors: mulingyuer
 * @Description: 模板
 * @FilePath: \undp-web\webpack\auto-load\template.js
 * 怎么可能会有bug！！！
 */
const path = require("path");
function pathResolve(pathText) {
  return path.resolve(__dirname, pathText);
};
const HtmlWebpackPlugin = require('html-webpack-plugin'); //模板插件
//cssAndScript
const cssAndScriptTemplete = pathResolve("../../src/ejs-templete/cssAndScript.ejs");


module.exports = function (entry = {}) {
  let htmlArr = [];

  Object.keys(entry).forEach(key => {

    //cssAndScript
    htmlArr.push(new HtmlWebpackPlugin({
      filename: `php-head/${key}.php`,  //输出的文件名
      template: cssAndScriptTemplete, //自定义模板
      chunks: [key], //指定入口块
      inject: false, //自定义模板不需要自动注入
      publicPath: "<?php aaa;?>",  //拼接php地址
      minify: {
        removeComments: true, //去除html注释
        collapseWhitespace: false, //去除换行
        minifyCSS: true //缩小样式元素和样式属性中css
      },
    }));
  });

  return htmlArr;
}