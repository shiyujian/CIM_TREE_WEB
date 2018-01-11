/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 * 
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from '../../store';
import {Auth, Header, DynamicTabs, Preview, Footer} from '_platform/components/layout';

export default class App extends Component {

	async componentDidMount() {
		const {default: Home} = await import('../../Home');
		const {default: Login} = await import('../../Loginair');
		const {default: Datum} = await import('../../Datum');
		const {default: Design} = await import('../../Design');
		const {default: System} = await import('../../System');
		// const {default: Setup} = await import('../../Setup');
		const {default: Selfcare} = await import('../../Selfcare');
		const {default: ModelDown} = await import('../../Down');
		this.setState({
			Home,
			Login,
			Datum,
			Design,
			Selfcare,
			System,
			// Setup,
			ModelDown
		});
	}

	render() {
		const {
			Home,
			Login,
			Datum,
			Design,
			Selfcare,
			System,
			// Setup,
			ModelDown
		} = this.state || {};
		return (
			<Provider store={store}>
				<BrowserRouter>
					<div style={{height: '100%'}}>
						<Route path="/:module?" component={Auth}/>
						<Route path="/:module?" component={Header}/>
						<Route path="/:module?" component={DynamicTabs}/>
						{Home && <Route exact path="/" component={Home}/>}
						{Login && <Route path="/login" component={Login}/>}
						{Datum && <Route path="/datum/:category?" component={Datum}/>}
						{Design && <Route path="/design" component={Design}/>}
						{Selfcare && <Route path="/selfcare" component={Selfcare}/>}
						{System && <Route path="/system" component={System}/>}
						{/*Setup && <Route path="/setup" component={Setup}/>*/}
						{ModelDown && <Route path="/ModelDown" component={ModelDown}/>}
						<Route path="/:module?" component={Footer}/>
						{Preview && <Preview/>}
					</div>
				</BrowserRouter>
			</Provider>
		);
	}
}

