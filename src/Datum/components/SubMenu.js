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

}
