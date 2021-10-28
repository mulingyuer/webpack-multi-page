/*
 * @Author: mulingyuer
 * @Date: 2021-10-28 10:30:04
 * @LastEditTime: 2021-10-28 10:51:34
 * @LastEditors: mulingyuer
 * @Description: 自动加载入口文件
 * @FilePath: \undp-web\webpack\auto-load\index.js
 * 怎么可能会有bug！！！
 */
const glob = require("glob");
const path = require("path");

//获取入口
function getEntry() {
  const entry = {};
  glob.sync("./src/entry/*/index.js").forEach(function (filePath) {
    //获取name
    const name = filePath.match(/src\/entry\/(.+)\/index\.js/)[1];
    //入口
    entry[name] = filePath;
  })
  return entry;
}


module.exports = getEntry;