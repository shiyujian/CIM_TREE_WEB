import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {Icon} from 'react-fa';
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
		const {Datum, Engineering,Redios,Video} = this.state || {};
		return (
			<Body>
			<Aside>
				<Submenu {...this.props} menus={DatumContainer.menus}/>
			</Aside>
			<Main>
				{Datum && <Route exact path="/datum/standard" component={Datum}/>}
				{Engineering && <Route path="/datum/engineering" component={Engineering}/>}
				{Redios && <Route path="/datum/redios" component={Redios}/>}
				{Video && <Route path="/datum/video" component={Video}/>}
			</Main>
			</Body>);
	}

	static menus = [{
		key: 'datum',
		id: 'DATUM.STANDARD',
		path: '/datum/standard',
		name: '制度标准',
		icon: <Icon name="file-text-o"/>
	}, {
		key: 'engineering',
		id: 'DATUM.ENGINEERING',
		path: '/datum/engineering',
		name: '工程文档',
		icon: <Icon name="file-word-o"/>
	}, {
		key: 'redios',
		id: 'DATUM.REDIOS',
		path: '/datum/redios',
		name: '影像资料',
		icon: <Icon name="file-word-o"/>
	}, {
		key: 'video',
		id: 'DATUM.VIDEO',
		path: '/datum/video',
		name: '视频资料',
		icon: <Icon name="file-word-o"/>
	}
];
}
