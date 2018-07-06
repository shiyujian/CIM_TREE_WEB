/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const IP = require('ip').address();
const PORT = 8888;
exports.IP = IP;
exports.PORT = PORT;
exports.HOST = `http://${IP}:${PORT}/`;
