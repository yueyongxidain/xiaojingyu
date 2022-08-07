const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const path = require('path')
const isDev = process.env.npm_lifecycle_event !== 'prod'

config = {
    entry: {
        main: './src/main/index.tsx',
        setting: './src/setting/index.tsx',
    },
    output: {
        path: path.resolve(__dirname, '../../.Render'),
        filename: 'static/js/[name].[hash:8].js',
        chunkFilename: 'static/js/[name].[hash:8].chunk.js',
        publicPath: './'
    },
    optimization: {
        minimize: false,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: (module) => /[\\/]node_modules[\\/]/.test(module.context) && !(/[\\/]node_modules[\\/](\@)?ant/.test(module.context)),
                    minChunks: 1,
                    priority: 10,
                    reuseExistingChunk: true,
                    name: 'vendors',
                },
                utilCommon: {
                    test: /[\\/]src[\\/]utils/,
                    minSize: 0,
                    priority: 20,
                    reuseExistingChunk: true,
                    name: 'utilCommon'
                }
            }
        },
        runtimeChunk: false,

    },
    resolve: {
        extensions: ['.js', '.jsx', '.d.ts', '.ts', '.tsx'],// 引入使可省略后缀
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.join(__dirname, '../', 'tsconfig.json')
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.(jsx?|tsx?)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: isDev
                        }
                    }
                ]
            },
            {
                test: /\.(css|less)$/,
                loader: ExtractTextPlugin.extract(
                    Object.assign(
                        {
                            publicPath: '../',
                            use: [
                                {
                                    loader: require.resolve('css-loader'),
                                    options: {
                                        importLoaders: 1
                                    },
                                },
                                {
                                    loader: require.resolve('postcss-loader'),
                                    options: {
                                        postcssOptions: {
                                            // Necessary for external CSS imports to work
                                            // https://github.com/facebookincubator/create-react-app/issues/2677
                                            ident: 'postcss',
                                            plugins: () => [
                                                require('postcss-plugin-px2rem')({
                                                    mediaQuery: false,
                                                    minPixelValue: 0,
                                                    propWhiteList: [],
                                                    propBlackList: [],
                                                    replace: true,
                                                    rootValue: 100,
                                                    selectorBlackList: [
                                                        'html'
                                                    ],
                                                    unitPrecision: 5
                                                })
                                            ],
                                        }
                                    },

                                },
                                {
                                    loader: require.resolve('less-loader'),
                                    options: {
                                        lessOptions: {
                                            javascriptEnabled: true
                                        }
                                    }
                                },
                            ],
                        },
                    )
                )
            },
            // 资源
            {
                test: /\.(bmp|gif|lpe?g|png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader',
                exclude: /node_modules/,
                options: {
                    name: "static/img/[name].[hash:8].[ext]",
                    limit: 10000,
                    esModule: false,
                    publicPath: "../../"
                }
            }

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'main.html',
            inject: true,
            excludeChunks: ['login', 'setting', 'download', 'detail'],
            favicon: 'public/favicon.ico',
            publicPath: './'
        }),
        new HtmlWebpackPlugin({
            template: 'public/login.html',
            filename: 'login.html',
            inject: true,
            excludeChunks: ['main', 'setting', 'download', 'detail'],
            favicon: 'public/favicon.ico',
            publicPath: './'
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'download.html',
            inject: true,
            excludeChunks: ['main', 'setting', 'login', 'detail'],
            favicon: 'public/favicon.ico',
            publicPath: './'
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'setting.html',
            inject: true,
            excludeChunks: ['main', 'login', 'download', 'detail'],
            favicon: 'public/favicon.ico',
            publicPath: './'
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'detail.html',
            inject: true,
            excludeChunks: ['main', 'login', 'download', 'setting'],
            favicon: 'public/favicon.ico',
            publicPath: './'
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        }),
        new ExtractTextPlugin({
            allChunks: true,
            filename: 'static/css/[name].css',
        }),

        new CleanWebpackPlugin(),
    ],
    node: {
        fs: "empty"
    }
}
module.exports = config
