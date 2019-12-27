const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const extractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SOURCE_PATH = path.resolve(__dirname, '../src');
const ENTRY_PATH = SOURCE_PATH + '/entries/';
// the path(s) that should be cleaned
let pathsToClean = [
  'dist',
]
// the clean options to use
let cleanOptions = {
  root: __dirname, // absolute path to your webpack root folder
  // exclude: ['shared.js'],
  verbose: true, // Write logs to console.
}

module.exports = {
  entry: ENTRY_PATH + "index.jsx",
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, './dist'),
    filename: '[hash].bundle.js',
    // chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: 'babel-loader'
      // options: {
      //   presets: ['env', 'react', 'stage-0'],
      //   plugins: [
      //     ["import", {
      //       "libraryName": "antd",
      //       "libraryDirectory": "es",
      //       "style": 'css', // or 'css'
      //     }]
      //   ]
      // }
    },
    {
      test: /\.jsx$/,
      loader: 'eslint-loader',
      enforce: "pre",
      include: [path.resolve(__dirname, 'src')], // 指定检查的目录
      // options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
      //     formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
      // }
    },
    {
      test: /\.css$/,
      use: [
        'style-loader', 'css-loader'
      ]
    },
    // {
    //   test: /\.less$/,
    //   use: [{
    //     loader: "style-loader" // creates style nodes from JS strings
    //   }, {
    //     loader: "css-loader" // translates CSS into CommonJS
    //   }, {
    //     loader: "less-loader" // compiles Less to CSS
    //   }]
    // },
    {
      test: /\.less$/,
      exclude: /node_modules/,
      use: [{
        loader: "style-loader" // creates style nodes from JS strings
      }, {
        loader: "css-loader", // translates CSS into CommonJS
        options: {
          sourceMap: true,
          modules: { // 必须启用css模块才能使用带hash的className
            localIdentName: '[path][name]__[local]' // 设置className格式
          }
        }
      }, {
        loader: "less-loader" // compiles Less to CSS
      }]
    }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'], //表示这几种文件的后缀名可以省略，按照从前到后的方式来进行补全
    alias: {
      components: SOURCE_PATH + '/components',
      // assets: SOURCE_PATH + '/assets',
      utils: SOURCE_PATH + '/utils',
      // config: SOURCE_PATH + '/config'
    }
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({    // in webpack4, it will be enabled when mode is production.
    //     test: /\.js($|\?)/i,
    //     cache: true,
    //     parallel: true,  // Enable parallelization. Default number of concurrent runs: os.cpus().length - 1.
    //     sourceMap: true
    // }),
    new HtmlWebpackPlugin({ // 将js, css文件引入html中
      title: "Application",
      filename: 'index.html',
      template: ENTRY_PATH + 'index.html',
      inject: 'body',
      hash: false // will append like bundle.js?[hash] if true, instead, we configure the hash in output.
    }),
    new extractTextWebpackPlugin('[hash].css'),
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    // new CopyWebpackPlugin([{
    //     from: SOURCE_PATH + '/src/assets/js',
    //     to: 'assets/js'
    //   },
    //   {
    //     from: SOURCE_PATH + '/src/assets/image',
    //     to: 'assets/image'
    //   },
    //   {
    //     from: SOURCE_PATH + '/src/assets/json',
    //     to: 'assets/json'
    //   }
    // ]),
    new webpack.ContextReplacementPlugin(
      /moment[/\\]locale$/,
      /zh-cn/,
    )
  ]
};