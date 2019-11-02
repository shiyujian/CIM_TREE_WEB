/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {PORT} = require('../constant/host');
const server = require('./main');

server.listen(PORT);
console.log(`Server is now running at http://localhost:${PORT}.`);
