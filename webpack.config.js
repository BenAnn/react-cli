const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


function parseNpmLifecycleEvent(event) {

  if (typeof event !== 'string') {
    throw TypeError('you are not passing the npm_lifecycle_event, got: ' + event.toString())
  }

  const op = event.split(':')[0]
  const target = event.split(':')[1]

  return {
    op,
    target
  }
}

const npmEvent = parseNpmLifecycleEvent(process.env.npm_lifecycle_event)
const production = process.env.NODE_ENV === 'production';

if (!npmEvent.target) {
  throw new Error(
    'pass a target right after `npm start` or `npm run build` cmd.\n' +
    'expect: npm run start:target, actual: ' + npmEvent.op
  )
}



const PATH = {
  root: path.join(__dirname, 'pages'),
  base: path.join(__dirname, 'dist'),
  src: path.join(__dirname, `pages/${npmEvent.target}`),
  dist: path.join(__dirname, `dist/${npmEvent.target}`)
}

const common = {
  entry: {
    app: PATH.src,
    vendor: ['react', 'react-dom', 'react-router-dom']
  },
  output: {
    path: PATH.dist,
    filename: '[name].js',
    publicPath: production?`http://resource.alphagif.com/dist/${npmEvent.target}`:'',
    chunkFilename: '[name].js'
  },
  // publicPath: PATH.dist,
  resolve: {
    extensions: ['.js', '.jsx', '.sass'],
    alias: {
      "components": path.resolve(__dirname, `pages/${npmEvent.target}/components`),
      "utils": path.resolve(__dirname, `pages/${npmEvent.target}/utils`),
      "publicComponents":  path.resolve(__dirname,`pages/demo/components`)
    }
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      template: path.join(PATH.src, 'assets/tpl.html'),
      filename: `${npmEvent.target}.html`,
      hash: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: [ // 提取公共模块名称
        'vendor'
      ],
      filename: 'vendor.js', // 公共模块文件名
      minChunks: Infinity // Infinity 表示仅仅创建公共组件块，不会把任何modules打包进去。
    })
  ],
  module: {
    rules: [{
        test: /\.scss/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true //css压缩
            }
          }, "sass-loader"]
        })
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif|mp4|webm)(\?\S*)?$/,
        include: PATH.root,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(js|jsx)$/,
        include: PATH.root,
        loader: 'babel-loader'
      }
    ]
  }
}

if (npmEvent.op === 'start') {
  module.exports = merge(common, {
    devServer: {
      hot: true,
      inline: true,
      stats: 'errors-only',
      contentBase: PATH.base
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new OpenBrowserPlugin({
        url: `http://localhost:8080/${npmEvent.target}.html`
      })
    ],
    devtool: 'source-map'
  })
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"development"'
  })
}
if (npmEvent.op === 'build') {
  module.exports = merge(common, {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        comments: false, //去掉注释
        compress: {
          warnings: false //忽略警告,要不然会有一大堆的黄色字体出现……
        }
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new UglifyJSPlugin()
    ]
  })
}