/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const express = require('express');
const webpack = require('webpack');
const history = require('connect-history-api-fallback');
const compress = require('compression');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('../config/dev');
const { DIST } = require('../constant/path');

const app = express();
app.use(history());
app.use(compress());

const compiler = webpack(config);

console.log('Enable webpack dev and HMR middleware');
app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: DIST,
        hot: true,
        quiet: false,
        noInfo: false,
        lazy: false,
        stats: {
            chunks: false,
            chunkModules: false,
            colors: true
        }
    })
);
app.use(webpackHotMiddleware(compiler));

console.log('serve static files');
app.use(express.static(DIST));

module.exports = app;
