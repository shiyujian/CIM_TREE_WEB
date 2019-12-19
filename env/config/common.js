/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
    SRC,
    DIST,
    NODE_MODULES,
    APP,
    THEME,
    TEMPLATE,
    FAVICON
} = require('../constant/path');
const { description, vendors, externals } = require('../constant/pkg');
const options = require('../constant/query');
const autoprefixer = require('autoprefixer');

const themeConfig = require(THEME);
module.exports = {
    target: 'web',
    devtool: 'cheap-module-eval-source-map',
    entry: {
        app: APP,
        vendor: vendors
    },
    context: SRC,
    output: {
        filename: `[name].[hash].js`,
        path: DIST,
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: SRC,
                use: [
                    {
                        loader: 'babel-loader',
                        options
                    }
                ]
            },
            {
                test: /\.css$/,
                include: SRC,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader?localIdentName=[local]--[hash:base64:5]&modules',
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    autoprefixer({
                                        browsers: [
                                            '>1%',
                                            'last 4 versions',
                                            'Firefox ESR',
                                            'not ie < 9'
                                        ],
                                        flexbox: 'no-2009'
                                    })
                                ]
                            }
                        }
                    ],
                    publicPath: 'css/'
                })
            },
            {
                test: /\.less$/,
                include: SRC,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9'
                                    ],
                                    flexbox: 'no-2009'
                                })
                            ]
                        }
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                include: NODE_MODULES,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                include: NODE_MODULES,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    `less-loader?{'modifyVars':${JSON.stringify(
                        themeConfig()
                    )}}`
                ]
            },
            {
                // test: /\.(png|jpe?g|gif|ttf|eot|svg|woff|woff2)$/,
                test: /\.(png|jpe?g|gif|ttf)$/,
                include: SRC,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'images/[name].[hash].[ext]'
                        }
                    }
                ]
            },
            {
                // test: /\.(png|jpe?g|gif|ttf|eot|svg|woff|woff2)$/,
                test: /\.(png|jpe?g|gif|ttf)$/,
                include: NODE_MODULES,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'images/[name].[hash].[ext]'
                        }
                    }
                ]
            },
            // {
            //     test: /\.(ttf|eot|svg|woff|woff2)$/,
            //     include: SRC,
            //     use: [
            //         {
            //             loader: 'url-loader',
            //             options: {
            //                 limit: 8192,
            //                 name: 'images/[name].[hash].[ext]'
            //             }
            //         }
            //     ]
            // },
            // {

            //     test: /\.(ttf|eot|svg|woff|woff2)$/,
            //     include: NODE_MODULES,
            //     use: [
            //         {
            //             loader: 'url-loader',
            //             options: {
            //                 limit: 8192,
            //                 name: 'images/[name].[hash].[ext]'
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                include: NODE_MODULES,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 8192,
                            name: 'fonts/[hash].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: description,
            template: TEMPLATE,
            hash: false,
            favicon: FAVICON,
            filename: 'index.html',
            inject: 'body'
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: [
                'config.js'
                /* `config_${process.env.proj}.js`, */
            ],
            append: false,
            hash: true
        }),
        new CopyWebpackPlugin([
            { from: '../static/Dockerfile' },
            { from: '../static/pip.conf' },
            { from: '../static/qh2web_nginx.conf' },
            { from: '../static/sources.list' },
            { from: '../static/supervisord.conf' },

            // { from: '../static/leaflet', to: 'leaflet/' },
            { from: '../static/fonts', to: 'fonts/' },
            { from: '../static/gooflow', to: 'gooflow/' },
            { from: '../static/oajs', to: 'oajs/' },
            { from: '../static/pdfjs', to: 'pdfjs/' },
            { from: '../static/jquery.min.js' },
            { from: '../static/jquery.jqprint-0.3.js' },
            { from: '../static/webVideoCtrl.js' },
            {
                from: `../static/DeathCode_${process.env.proj}.js`,
                to: 'DeathCode.js'
            },
            { from: `../static/dippingdemo`, to: 'dippingdemo/' },
            { from: `../static/scan/html/treeDetail.html`, to: 'scan.html' },

            {
                from: `../src/APP/${process.env.proj}/config_${
                    process.env.branch
                }.js`,
                to: 'config.js'
            }
        ]),
        new ExtractTextPlugin('css/[name].[contenthash].css')
    ],
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['.js', '.json', '.jsx', '.react.js']
    },
    externals
};
