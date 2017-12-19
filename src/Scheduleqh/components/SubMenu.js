import React, {Component} from 'react';
import {Menu} from 'antd';
import {Link} from 'react-router-dom';
import {Icon} from 'react-fa';
const Item = Menu.Item;

export default class Submenu extends Component {
	render() {
		return (
			<Menu selectedKeys={this.selectKey()}>
				{
					Submenu.menus.map(menu => {
						return (
							<Item key={menu.key}>
								<Link onClick={e => menu.disabled && e.preventDefault()} to={menu.path}>
									{menu.icon}
									{menu.name}
								</Link>
							</Item>)
					})
				}
			</Menu>
		);
	}

	selectKey() {
		const {location: {pathname = ''} = {}} = this.props;
		const {key = ''} = Submenu.menus.find(menu => menu.path === pathname) || {};
		if (key) {
			return [key]
		}
		return [];
	}

	static menus = [{
		key: 'schedule',
		path: '/schedule',
		name: '统计分析',
		icon: <Icon name="thermometer-empty"/>
	},{
		key: 'total',
		path: '/schedule/total',
		name: '总体进度',
		icon: <Icon name="thermometer-three-quarters"/>
	},{
		key: 'stage',
		path: '/schedule/stage',
		name: '分期进度',
		icon: <Icon name="thermometer-three-quarters"/>
	},{
		key: 'dgn',
		path: '/schedule/dgn',
		name: '进度模拟',
		icon: <Icon name="thermometer-three-quarters"/>
	},{
		key: 'notice',
		path: '/schedule/notice',
		name: '进度预警',
		icon: <Icon name="pencil-square-o"/>
	},{
		key: 'history',
		path: '/schedule/history',
		name: '进度历史',
		icon: <Icon name="pencil-square-o"/>
	}];
}
