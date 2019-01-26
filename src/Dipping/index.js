/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-07-04 14:32:29
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2019-01-26 10:52:51
 */
/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-07-04 14:32:11
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-07-04 14:32:11
 */
// import {injectReducer} from '../store';
// import React, {Component} from 'react';

// export default class Dashboard extends Component {

// 	async componentDidMount() {
// 		const {default: reducer} = await import('./store');
// 		const Containers = await import('./containers');
// 		injectReducer('dashboard', reducer);
// 		this.setState({
// 			...Containers
// 		});
// 	}

// 	render() {
// 		const {Map = null} = this.state || {};
// 		return (
// 			<div style={{position: 'relative', width: '100%', height: 'calc( 100% - 80px )'}}>
// 				{Map && <Map {...this.props}/>}
// 			</div>)
// 	}
// };

import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Aside, Main } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import { Icon } from 'react-fa';

export default class DippingModel extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('Dipping', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        console.log('aaaaaaaaaaaaaaaa');
        const {Dipping = null} = this.state || {};
        return (Dipping && <Dipping {...this.props} />);
    }
}
