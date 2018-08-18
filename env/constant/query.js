/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
    cacheDirectory: true,
    presets: ['es2015', 'react', 'stage-0'],
    plugins: [
        ['transform-runtime', {
            helpers: false,
            polyfill: false,
            regenerator: true
        }],
        'transform-decorators-legacy',
        ['import', { 'libraryName': 'antd', 'style': true }]
    ]
};
