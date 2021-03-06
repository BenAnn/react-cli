const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


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
    },
    output: {
        path: PATH.dist,
        filename: '[name].js',
        publicPath: production ? `http://resource.alphagif.com/dist/${npmEvent.target}` : '',
        chunkFilename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.sass'],
        alias: {
            "@components": path.resolve(__dirname, `pages/${npmEvent.target}/components`),
            "@utils": path.resolve(__dirname, `pages/${npmEvent.target}/utils`),
            "@publicComponents": path.resolve(__dirname, `pages/demo/components`)
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({
            template: path.join(PATH.src, 'assets/tpl.html'),
            filename: `${npmEvent.target}.html`,
            hash: true,
            chunks: ['app', 'commons']
        }),
    ],
    module: {
        rules: [{
                test: /\.scss/,
                use: [MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {
                        minimize: true, //css压缩
                        importLoaders: 1
                    }
                }, { loader: "sass-loader" }]
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
        optimization: {
            splitChunks: {
                chunks: 'all',
                minSize: 30000,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '-',
                name: true,
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'commons',
                        priority: -10,
                        chunks: 'all'
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                },
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'
            }),
            new BundleAnalyzerPlugin()
        ]
    })
}