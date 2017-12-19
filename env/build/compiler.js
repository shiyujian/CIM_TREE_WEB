/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 * 
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const webpack = require('webpack');

const compiler = (config, statsFormat) => {
    statsFormat = statsFormat || {
        chunks: false,
        chunkModules: false,
        colors: true
    };
    return new Promise((resolve, reject) => {
        const compiler = webpack(config);
        compiler.run((err, stats) => {
            if (err) {
                console.log('Webpack compiler encountered a fatal error.', err);
                return reject(err)
            }
            const jsonStats = stats.toJson();
            console.log('Webpack compile completed.');
            console.log(stats.toString(statsFormat));
            if (jsonStats.errors.length > 0) {
                console.log('Webpack compiler encountered errors.');
                console.log(jsonStats.errors.join('\n'));
                return reject(new Error('Webpack compiler encountered errors'))
            } else if (jsonStats.warnings.length > 0) {
                console.log('Webpack compiler encountered warnings.');
                console.log(jsonStats.warnings.join('\n'))
            } else {
                console.log('No errors or warnings encountered.')
            }
            resolve(jsonStats)
        })
    })
};

module.exports = (config) => {
    return Promise.resolve()
        .then(() => compiler(config))
        .then((stats) => {
            if (stats.warnings.length && false) throw new Error('Config set to fail on warning, exiting with status code "1".');
        })
        .then(() => {
            console.log('Compilation completed successfully.')
        })
        .catch((err) => {
            console.log('Compiler encountered an error.', err);
            process.exit(1)
        })
};
