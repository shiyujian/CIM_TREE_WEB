/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 * 
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {QH, XA, Air} from './APP';
import 'babel-polyfill';
require('es6-promise').polyfill();

if(__env__ == 'qh'){
	ReactDOM.render(<QH/>, document.getElementById('root'));
	// document.domain = "simulate.com";
	if (module.hot) {
		module.hot.accept('./APP/qh/app', () => {
			const NextApp = require('./APP/qh/app').default;
			ReactDOM.render(
				<NextApp/>,
				document.getElementById('root')
			);
		});
	}
}

if(__env__ == 'xa'){
	ReactDOM.render(<XA/>, document.getElementById('root'));

	if (module.hot) {
		module.hot.accept('./APP/xa/app', () => {
			const NextApp = require('./APP/xa/app').default;
			ReactDOM.render(
				<NextApp/>,
				document.getElementById('root')
			);
		});
	}
}


if(__env__ == 'air'){
	ReactDOM.render(<Air/>, document.getElementById('root'));

	if (module.hot) {
		module.hot.accept('./APP/air/app', () => {
			const NextApp = require('./APP/air/app').default;
			ReactDOM.render(
				<NextApp/>,
				document.getElementById('root')
			);
		});
	}
}