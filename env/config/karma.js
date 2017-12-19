/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 * 
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { TEST_BUNDLER } = require('../constant/path');
const testConfig = require('./test');

module.exports = function(config) {
    config.set({
        basePath: '../../',
        browsers: ['PhantomJS'], //run in Chrome
        singleRun: true,
        files: [
            { pattern: TEST_BUNDLER, watched: false },
        ],
        frameworks: ['mocha'],
        reporters: ['mocha'],
        preprocessors: {
            [TEST_BUNDLER]: ['webpack'],
        },
        webpack: testConfig,
        webpackMiddleware: {
            noInfo: true
        },
        coverageReporter: {
            reporters: [
                { type: 'text-summary' },
                { type: 'lcov', dir: 'coverage' }
            ]
        }
    });
};
