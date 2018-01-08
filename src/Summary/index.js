import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import {Icon} from 'react-fa';

export default class Summary extends Component {

	async componentDidMount() {
	}

	render() {
		return (
			<Body>
			<Aside>
				{/* <Submenu {...this.props} menus={Summary.menus}/> */}
			</Aside>
			<Main>
				<ContainerRouters menus={Summary.menus} containers={this.state}/>
			</Main>
			</Body>);
	}

	static menus = [
		{
			key: 'summary',
			name: '汇总分析',
            icon: <Icon name="puzzle-piece"/>,
            path:'/summary',
		}];


	// static defaultOpenKeys = ['engineering', 'Org', 'Document','event']
}




