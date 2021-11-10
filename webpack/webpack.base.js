/*
 * @Author: mulingyuer
 * @Date: 2021-10-28 11:03:37
 * @LastEditTime: 2021-11-10 11:24:57
 * @LastEditors: mulingyuer
 * @Description:webpack基础配置
 * @FilePath: \webpack-multi-page\webpack\webpack.base.js
 * 怎么可能会有bug！！！
 */
const path = require("path");
function pathResolve(pathText) {
  return path.resolve(__dirname, pathText);
};

const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //css抽离插件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");//css压缩插件
const TerserPlugin = require("terser-webpack-plugin"); //js压缩
//获取入口
const getEntry = require("./auto-load/entry");
const entry = getEntry();
//模板
const getTemplate = require("./auto-load/template");
const templateArr = getTemplate(entry);

module.exports = {
  //模式
  mode: "none",
  //开发工具
  devtool: "none",
  //入口
  entry,
  //输出
  output: {
    path: pathResolve("../dist/"),  //输出的路径
    filename: "js/[name].[contenthash].min.js", //输出的js文件名（css单独设置）
    clean: true, //清理dist
  },
  //不打包指定的依赖（输出的 bundle 中排除依赖）
  externals: {
    // uikit: "UIkit",
  },
  //资源管理
  module: {
    rules: [
      //css
      {
        test: /\.(css)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      //scss、sass
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // 将 CSS 转化成 CommonJS 模块
          {
            loader: "css-loader",
            options: {
              //由于@import的问题，引入的文件可能不会被postcss-loader转换，所以回退1位
              importLoaders: 1
            }
          },
          "postcss-loader",
          // 将 Sass 编译成 CSS
          {
            loader: "sass-loader",
            options: {
              implementation: require("dart-sass"),
              sassOptions: {
                //dart-sass 的 charset 选项默认为 true，我们强烈建议你将其改为 false，
                //因为 webpack 并不支持utf-8 以外的文件
                charset: false,
              },
              //前置scss（全局scss）
              additionalData: `
                @import "@/assets/scss/color.scss";
                @import "@/assets/scss/mixins.scss";
              `
            }
          },
        ]
      },
      //images图片资源
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset", //在导出一个 data URI 和发送一个单独的文件之间自动选择
        generator: {
          filename: "images/[hash][ext][query]"
        }
      },
      //font字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]"
        }
      },
      //javascript
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/, //排除
        include: pathResolve("../src"), //只处理src目录下
        use: ["babel-loader"]
      }
    ]
  },
  //插件
  plugins: [
    //css样式抽离
    new MiniCssExtractPlugin({
      filename: "style/[name].style.css", //css文件命名
      chunkFilename: "[id].css", //公共样式
    }),
    //代码分析
    // new BundleAnalyzerPlugin({
    //   analyzerMode: "static",  //生成静态文件
    //   openAnalyzer: false, //不自动打开
    // })
    //模板
    ...templateArr
  ],
  //优化
  optimization: {
    moduleIds: "deterministic", //减少vendor在无变化时hash发生变换
    //提取引导模板
    runtimeChunk: {
      name: "manifest"
    },
    //公共内容拆分
    splitChunks: {
      cacheGroups: {
        //node_modules公共代码合并到vendors.js
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: -10, //权重,vendor优先
        },
        //业务共用代码提取
        commons: {
          test: /[\\/]src[\\/]/,
          name: "common",
          chunks: "all",
          priority: -20,//权重
          minChunks: 2,
          minSize: 0,
        }
      }
    },
    minimize: false, //开发模式也压缩代码
    minimizer: [
      //css压缩
      new CssMinimizerPlugin(),
      //js压缩
      new TerserPlugin({
        extractComments: false, //关闭生成LICENSE文件（注释文件）
      }),
    ]
  },
  //解析
  resolve: {
    //路径别名
    alias: {
      "@": pathResolve("../src"),
      "Utils": pathResolve("../src/utils"),
      "Assets": pathResolve("../src/assets"),
    }
  }
}