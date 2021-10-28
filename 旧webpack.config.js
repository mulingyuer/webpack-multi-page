/*
 * @Author: mulingyuer
 * @Date: 2021-10-27 11:04:11
 * @LastEditTime: 2021-10-28 10:59:02
 * @LastEditors: mulingyuer
 * @Description: webpack 配置文件
 * @FilePath: \undp-web\webpack.config.js
 * 怎么可能会有bug！！！
 */
const path = require("path");
function pathResolve(pathText) {
  return path.resolve(__dirname, pathText);
};
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //css抽离插件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");//css压缩插件
const TerserPlugin = require("terser-webpack-plugin"); //js压缩

const getEntry = require("./webpack/auto-load");


module.exports = {
  //模式
  mode: "development", //production
  //开发工具
  devtool: "source-map", //nosources-source-map
  //入口
  entry: getEntry(),
  //输出
  output: {
    path: pathResolve("./dist/"),  //输出的路径
    filename: "[name].[contenthash].min.js", //输出的文件名
    clean: true, //清理dist
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
              // sassOptions: {
              //   //dart-sass 的 charset 选项默认为 true，我们强烈建议你将其改为 false，
              //   //因为 webpack 并不支持utf-8 以外的文件
              //   charset: false
              // }
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
        include: pathResolve("./src"), //只处理src目录下
        use: ["babel-loader"]
      }
    ]
  },
  // 插件
  plugins: [
    //管理html输出
    new HtmlWebpackPlugin({
      title: "资源输出"
    }),
    //css样式抽离
    new MiniCssExtractPlugin({
      filename: "style.css", //css文件命名
      chunkFilename: "[id].css", //公共样式
    }),
    //代码分析
    // new BundleAnalyzerPlugin({
    //   analyzerMode: "static",  //生成静态文件
    //   openAnalyzer: false, //不自动打开
    // })
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
    minimize: true, //开发模式也压缩代码
    minimizer: [
      //css压缩
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: "advanced", // 需额外安装
        },
      }),
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
      "@": pathResolve("./src"),
      "Utils": pathResolve("./src/utils"),
      "Assets": pathResolve("./src/assets"),
    }
  }


}