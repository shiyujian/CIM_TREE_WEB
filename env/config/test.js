/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 * 
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { DefinePlugin } = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./common');
const { define } = require('../constant/env');
const { testExternals } = require('../constant/pkg');

console.log('Creating configuration.');
module.exports = merge(commonConfig, {
	devtool: 'cheap-module-source-map',
	resolve: Object.assign({}, commonConfig.resolve, {
		alias: Object.assign({}, commonConfig.resolve.alias, {
			sinon: 'sinon/pkg/sinon.js'
		})
	}),
	module: {
		noParse: [
			/\/sinon\.js/
		],
		loaders: [{
			test: /sinon(\\|\/)pkg(\\|\/)sinon\.js/,
			loader: 'imports?define=>false,require=>false'
		}]
	},
	plugins: [
		new DefinePlugin(define(process.env.proj)),
	],
	externals: testExternals
});
