import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route,Switch} from 'react-router-dom';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import {Icon} from 'react-fa';

export default class ReceiveContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Containers: {}
		}
	}
	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		console.log('condddd',Containers)
		injectReducer('receive', reducer);
		this.setState({
			...Containers
		});
	}

	render() {
		const {
			ReceiveManagement
		} = this.state || {};
		return (
			<Body >
				<Aside>
					<Submenu {...this.props} menus={ReceiveContainer.menus}/>
				</Aside>
				<Main>
					<ContainerRouters menus={ReceiveContainer.menus} containers={this.state}/>
				</Main>
			</Body>
		);
	}
	static menus = [{
		key: 'ReceiveManagement',
		id: 'RECEIVE.RECEIVEMANAGEMENT',
		name: '收货管理',
		path: '/receive',
		exact: true,
		icon: <Icon name="thermometer-empty"/>
	}, {
		key: 'DistributionManagement',
		id: 'DISTRIBUTIONMANAGEMENT',
		name: '发放管理',
		path: '/receive/distributionManagement',
		icon: <Icon name="thermometer-empty"/>
	}, {
		key: 'InventoryManagement',
		id: 'INVENTORYMANAGEMENT',
		name: '库存管理',
		path: '/receive/inventoryManagement',
		icon: <Icon name="building-o"/>
	}]
}