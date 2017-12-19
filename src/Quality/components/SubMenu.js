import React, {Component} from 'react';
import {Menu} from 'antd';
import {Link} from 'react-router-dom';
import {Icon} from 'react-fa';
const Item = Menu.Item;
const SubMenu = Menu.SubMenu;

export default class Submenu extends Component {
	render() {
		return (
			<Menu
			mode="inline"
			selectedKeys={this.selectKey()}>
				{
					Submenu.menus.map(menu => {
						return menu.childs?
						 (
							// <Item key={menu.key}>
							// 	<Link onClick={e => menu.disabled && e.preventDefault()} to={menu.path}>
							// 		{menu.icon}
							// 		{menu.name}
							// 	</Link>
							// </Item>
							<SubMenu key={menu.key} title={
								<Link onClick={e => menu.disabled && e.preventDefault()} to={menu.path}>
									{menu.icon}
									{menu.name}
								</Link>
							}>
							{
								!menu.childs?null:menu.childs.map(child=>{
									return(
										<Link onClick={e => menu.disabled && e.preventDefault()} to={child.path}>
											{child.name}
										</Link>
									) ;
								})
							}
							</SubMenu>
						):(
							<Item key={menu.key}>
								<Link onClick={e => menu.disabled && e.preventDefault()} to={menu.path}>
									{menu.icon}
									{menu.name}
								</Link>
							</Item>
						)

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
		key: 'tongji',
		name: '统计分析',
		path: '/quality',
		icon: <Icon name="tasks"/>
	}, {
		key: 'yanshou',
		name: '质量验收',
		path: '/quality/yanshou',
		icon: <Icon name="check-square-o"/>,
		childs:[
		{
			name:'验收查询',
			path:''
		},		{
			name:'检验批划分',
			path:'/quality/yanshou/huafen'
		},		{
			name:'检验批填报',
			path:''
		},		{
			name:'分项验收',
			path:''
		},		{
			name:'分部验收',
			path:''
		},		{
			name:'单位工程验收',
			path:''
		},
	]
	}, {
		key: 'monitoring',
		name: '质量监控',
		path: '/quality/monitoring',
		icon: <Icon name="wpforms"/>,
	}, {
		key: 'defect',
		name: '质量缺陷',
		path: '/quality/defect',
		icon: <Icon name="life-buoy"/>
	}];
}
