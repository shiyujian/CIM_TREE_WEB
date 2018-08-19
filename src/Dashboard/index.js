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
 * @Last Modified time: 2018-08-18 17:04:14
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

export default class Dashboard extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('dashboard', reducer);
        this.setState({
            ...Containers
        });
    }

    // render () {
    //     const { OnSite, Project, Plan, Danger } = this.state || {};
    //     return (
    //         <div style={{ display: 'flex' }}>
    //             <Aside style={{ overflow: 'hidden' }}>
    //                 <Submenu
    //                     {...this.props}
    //                     menus={Dashboard.menus}
    //                     defaultOpenKeys={Dashboard.defaultOpenKeys}
    //                 />
    //             </Aside>
    //             <Main>
    //                 <Switch>
    //                     {OnSite && (
    //                         <Route exact path='/dashboard' component={OnSite} />
    //                     )}
    //                     {OnSite && (
    //                         <Route
    //                             path='/dashboard/onsite'
    //                             component={OnSite}
    //                         />
    //                     )}
    //                     {Project && (
    //                         <Route
    //                             path='/dashboard/project'
    //                             component={Project}
    //                         />
    //                     )}
    //                 </Switch>
    //             </Main>
    //         </div>
    //     );
    // }

    render () {
        const {OnSite = null} = this.state || {};
        return (OnSite && <OnSite {...this.props} />);
    }
    static menus = [
        {
            key: 'ONSITE',
            id: 'DASHBOARD.ONSITE',
            path: '/dashboard/onsite',
            name: '二维展示',
            icon: <Icon name='map-o' />
        },
        {
            key: 'PROJECT',
            id: 'DASHBOARD.PROJECT',
            path: '/dashboard/project',
            name: '工程影像',
            icon: <Icon name='caret-square-o-up' />
        }
    ];
    static defaultOpenKeys = ['ONSITE'];
}
