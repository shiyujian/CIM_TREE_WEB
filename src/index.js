/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 * 
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';
//antdesign3.0国际化概念
import { LocaleProvider } from 'antd';
import zh_TW from 'antd/lib/locale-provider/zh_TW';
// import {QH, XA, Air,Tree} from './APP';//此处不需要引入，会导致热更新失败
import 'babel-polyfill';
require('es6-promise').polyfill();
import $ from 'jquery';
import './hack.css';


// $('.js-scroll').mCustomScrollbar({
// 	mouseWheel: {
// 		preventDefault: true
// 	},
// 	scrollInertia: 10,
// 	autoHideScrollbar: true,
// 	advanced: {
// 		autoExpandHorizontalScroll: true,
// 		updateOnImageLoad: false,
// 		updateOnContentResize: true
// 	},
// 	theme: "dark-3",
// 	live: 'on'
// });
const MOUNT_NODE = document.getElementById('root');
if(__env__ == 'tree'){

	// ReactDOM.render(<Tree/>, document.getElementById('root'));

	// if (module.hot) {
	// 	module.hot.accept('./APP/tree/app', () => {
	// 		const NextApp = require('./APP/tree/app').default;
	// 		ReactDOM.render(
	// 			<NextApp/>,
	// 			document.getElementById('root')
	// 		);
	// 	});
	// }

	let render = () => {
		const TREE = require('./App/tree/app').default;
		ReactDOM.render(<LocaleProvider locale={zh_TW}><TREE /></LocaleProvider>, MOUNT_NODE);
	}
	if (module.hot) {
		module.hot.accept('./App/tree/app', () =>
			setImmediate(() => {
				ReactDOM.unmountComponentAtNode(MOUNT_NODE);
				render();
			})
		);
	}
	render();
}
