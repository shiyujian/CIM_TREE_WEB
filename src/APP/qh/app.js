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
		const {default: Login} = await import('../../LoginQH');
		const {default: Dashboard} = await import('../../Dashboard');
		const {default: Overall} = await import('../../Overall');
		const {default: Datum} = await import('../../Datum');
		const {default: Design} = await import('../../Design');
		const {default: Quality} = await import('../../Quality');
		const {default: Schedule} = await import('../../ScheduleQH');
		const {default: System} = await import('../../System');
		const {default: Setup} = await import('../../Setup');
		const {default: Selfcare} = await import('../../Selfcare');
		const {default: ModelDown} = await import('../../Down');
		const {default: Video} = await import('../../Video');
		const {default: Cost} = await import('../../Cost');
		const {default: Safety} = await import('../../Safety');
		const {default: DataReport} = await import('../../Datareport');
		this.setState({
			Home,
			Login,
			Dashboard,
			Overall,
			Datum,
			Design,
			Quality,
			Schedule,
			Selfcare,
			System,
			Setup,
			ModelDown,
			Video,
			Cost,
			Safety,
			DataReport
		});
	}

	render() {
		const {
			Home,
			Login,
			Dashboard,
			Overall,
			Datum,
			Design,
			Quality,
			Schedule,
			Selfcare,
			System,
			Setup,
			ModelDown,
			Video,
			Cost,
			Safety,
			DataReport
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
						{Dashboard && <Route path="/dashboard" component={Dashboard}/>}
						{Overall && <Route path="/overall" component={Overall}/>}
						{Datum && <Route path="/datum/:category?" component={Datum}/>}
						{Design && <Route path="/design" component={Design}/>}
						{Quality && <Route path="/quality" component={Quality}/>}
						{Schedule && <Route path="/schedule" component={Schedule}/>}
						{Selfcare && <Route path="/selfcare" component={Selfcare}/>}
						{System && <Route path="/system" component={System}/>}
						{Setup && <Route path="/setup" component={Setup}/>}
						{ModelDown && <Route path="/ModelDown" component={ModelDown}/>}
						{Cost && <Route path="/cost" component={Cost}/>}
						{Video && <Route path="/video" component={Video}/>}
						{Safety && <Route path="/safety" component={Safety}/>}
						{DataReport && <Route path="/data" component={DataReport}/>}
						<Route path="/:module?" component={Footer}/>
						{Preview && <Preview/>}
					</div>
				</BrowserRouter>
			</Provider>
		);
	}
}

