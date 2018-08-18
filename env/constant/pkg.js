/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {name, version, description, theme} = require('../../package.json');
exports.name = name;
exports.version = version;
exports.description = description;
exports.theme = theme;

exports.vendors = [
    'react',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux',
    'redux-actions',
    'redux-thunk',
    'react-fa',
    'antd',
    'moment'
];

exports.externals = {
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react/addons': true,
    'jquery': 'window.jQuery'
};

exports.testExternals = {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window'
};
