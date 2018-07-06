/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {
    DefinePlugin,
    optimize: { CommonsChunkPlugin, UglifyJsPlugin }
} = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { define } = require('../constant/env');
const commonConfig = require('./common');

const compress = {
    unused: true,
    dead_code: true,
    warnings: false,
    drop_debugger: true, // 发布时去除debugger语句
    drop_console: true // 发布时去除console语句
};

console.log('start build...');
module.exports = merge(commonConfig, {
    devtool: false,
    plugins: [
        new DefinePlugin(define(process.env.proj)),
        new UglifyJsPlugin({ compress }),
        new CommonsChunkPlugin({
            names: ['vendor']
        }),
        new ExtractTextPlugin({
            filename: '[name].[contenthash].css',
            disable: false,
            allChunks: true
        })
    ]
});
