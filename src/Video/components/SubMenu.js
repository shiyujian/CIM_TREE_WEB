import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Menu,Icon} from 'antd';
const Item = Menu.Item;
const SubMenu = Menu.SubMenu;

export default class Submenu extends Component {

	render() {
		return (
			<Menu mode="inline" selectedKeys={this.selectKey()} defaultOpenKeys={Submenu.defaultOpenKeys}>
				{
					Submenu.menus.map(menu => {
						const {key, name, children = []} = menu;
						if (children.length) {
							return <SubMenu key={key} title={name}>
								{
									children.map(item => {
										const {key, name, path, disabled, icon} = item;
										return (
											<Item key={key}>
												<Link onClick={e => disabled && e.preventDefault()} to={path}>
													{icon}
													{name}
												</Link>
											</Item>)
									})
								}
							</SubMenu>
						} else {
							const {key, name, path, disabled, icon} = menu;
							return (
								<Item key={key}>
									<Link onClick={e => disabled && e.preventDefault()} to={path}>
										{icon}
										{name}
									</Link>
								</Item>)
						}
					})
				}
			</Menu>);
	}

	selectKey() {
		const {location: {pathname = ''} = {}} = this.props;
		const selectedKeys = [];

		Submenu.menus.forEach(menu => {
			const {children = []} = menu;
			if (children.length) {
				const {key = ''} = children.find(menu => menu.path === pathname) || {};
				if (key) selectedKeys.push(key);
			} else {
				if (menu.path === pathname) selectedKeys.push(menu.key);
			}
		});

		return selectedKeys;
	}

	static menus = [{
		key: 'video',
		name: '视频监控',
		path: '/video/monitor',
		icon: <Icon name="podcast"/>
	},{
		key: '360Camera',
		name: '全景图',
		path: '/video/360Camera',
		icon: <Icon name="podcast"/>
	}];

	static defaultOpenKeys = ['design', 'file', '_model']
};


