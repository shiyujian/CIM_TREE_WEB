/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 * 
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {resolve} = require('path');
const {theme} = require('./pkg');
const {HOST} = require('./host');

const BASE = resolve(__dirname, '..', '..');
const SRC = resolve(BASE, 'src');
const NODE_MODULES = resolve(BASE, 'node_modules');
const STATIC = resolve(BASE, 'static');
const TEST = resolve(BASE, 'tests');
const DIST = resolve(BASE, `dist/dist_${process.env.proj}`);

exports.BASE = BASE;
exports.SRC = SRC;
exports.DIST = DIST;
exports.NODE_MODULES = NODE_MODULES;
exports.APP = resolve(SRC, 'index.js');
exports.THEME = resolve(BASE, theme);

exports.STATIC = STATIC;
exports.TEMPLATE = resolve(STATIC, 'template.html');
exports.FAVICON = resolve(STATIC, `favicon_${process.env.proj}.ico`);

exports.REACT = resolve(NODE_MODULES, 'react/react.js');
exports.REACT_DOM = resolve(NODE_MODULES, 'react/lib/ReactDOM');
exports.HMR = `webpack-hot-middleware/client?path=${HOST}__webpack_hmr`;

exports.TEST = TEST;
exports.TEST_BUNDLER = resolve(TEST, 'test-bundler.js');
