/*
 * @Author: mulingyuer
 * @Date: 2021-10-27 21:55:00
 * @LastEditTime: 2021-10-27 21:56:18
 * @LastEditors: mulingyuer
 * @Description: 工具
 * @FilePath: \undp-web\src\utils\tool.js
 * 怎么可能会有bug！！！
 */

/**
 * @description: 获取数据类型
 * @param {*} value
 * @Date: 2021-10-27 21:55:57
 * @Author: mulingyuer
 */
export function getTypeof(value) {
  let type = typeof value;
  if (type !== "object") {
    return type;
  }
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};
