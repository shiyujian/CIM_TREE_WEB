import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {Icon} from 'react-fa';

export default class Dataresource extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		injectReducer('dataresource', reducer);
		this.setState({
			...Containers
		})
	}

	render() {
		const {Statistics, Datamenu, Bimdata, Apiservice, Application, Platformplugins, News, Regulation, Pricedata} = this.state || {};
		return (
			<Body>
			<Aside>
				<Submenu {...this.props} menus={Dataresource.menus}/>
			</Aside>
			<Main>
				{Statistics && <Route exact path="/dataresource" component={Statistics}/>}
				{Datamenu && <Route path="/dataresource/datamenu" component={Datamenu}/>}
				{Bimdata && <Route path="/dataresource/bimdata" component={Bimdata}/>}
				{Apiservice && <Route path="/dataresource/apiservice" component={Apiservice}/>}
				{Application && <Route path="/dataresource/application" component={Application}/>}
				{Platformplugins && <Route path="/dataresource/platformplugins" component={Platformplugins}/>}
				{News && <Route path="/dataresource/news" component={News}/>}
				{Regulation && <Route path="/dataresource/regulation" component={Regulation}/>}
				{Pricedata && <Route path="/dataresource/pricedata" component={Pricedata}/>}
			</Main>
			</Body>);
	}

	static menus = [{
		key: 'statistics',
		id: 'STATISTICS',
		path: '/dataresource',
		name: '资源统计',
		icon: <Icon name="file"/>,
	}, {
		key: 'datamenu',
		id: 'DATAMENU',
		path: '/dataresource/datamenu',
		name: '数据目录',
		icon: <Icon name="file"/>,
	}, {
		key: 'bimdata',
		id: 'BIMDATA',
		path: '/dataresource/bimdata',
		name: 'BIM 数据',
		icon: <Icon name="file"/>,
	}, {
		key: 'apiservice',
		id: 'APISERVICE',
		path: '/dataresource/apiservice',
		name: 'API 服务',
		icon: <Icon name="file"/>,
	},  /*{
		key: 'application',
		id: 'APPLICATION',
		path: '/dataresource/application',
		name: 'APP 应用',
		icon: <Icon name="file"/>,
	}, {
		key: 'platformplugins',
		id: 'PLATFORMPLUGINS',
		path: '/dataresource/platformplugins',
		name: '平台插件',
		icon: <Icon name="file"/>,
	}, {
		key: 'news',
		id: 'NEWS',
		path: '/dataresource/news',
		name: '新闻公告',
		icon: <Icon name="file"/>,
	}, */{
		key: 'regulation',
		id: 'REGULATION',
		path: '/dataresource/regulation',
		name: '规章制度',
		icon: <Icon name="file"/>,
	}/*, {
		key: 'pricedata',
		id: 'PRICEDATA',
		path: '/dataresource/pricedata',
		name: '价格数据',
		icon: <Icon name="file"/>,
	}*/];
}
