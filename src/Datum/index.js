import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {Icon} from 'react-fa';
import Radio from 'antd/lib/radio/radio';
import Redios from './containers/Redios';

export default class DatumContainer extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		injectReducer('datum', reducer);
		this.setState({
			...Containers
		})
	}

	render() {
		const {Datum, Engineering,Radios} = this.state || {};
		return (
			<Body>
			<Aside>
				<Submenu {...this.props} menus={DatumContainer.menus}/>
			</Aside>
			<Main>
				{Datum && <Route exact path="/datum" component={Datum}/>}
				{Engineering && <Route path="/datum/engineering" component={Engineering}/>}
				{Redios && <Route path="/datum/redios" component={Redios}/>}
			</Main>
			</Body>);
	}

	static menus = [{
		key: 'datum',
		id: 'DATUM.STANDARD',
		path: '/datum',
		name: '制度标准',
		icon: <Icon name="file-text-o"/>
	}, {
		key: 'engineering',
		id: 'DATUM.ENGINEERING',
		path: '/datum/engineering',
		name: '工程文档',
		icon: <Icon name="file-word-o"/>
	},{
		key: 'redios',
		id: 'DATUM.REDIO',
		path: '/datum/redios',
		name: '工程影像',
		icon: <Icon name="file-word-o"/>
	}];
}
