import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Menu} from 'antd';
import {getUser, getPermissions} from '../../auth';

const Item = Menu.Item;
const SubMenu = Menu.SubMenu;

export default class Submenu extends Component {
    render () {
        const {menus = [], defaultOpenKeys = []} = this.props;
        let isSuperuser = false;
        const user = getUser();
        if (user && user.username === 'admin') {
            isSuperuser = true;
        }
        const permissions = getPermissions() || [];

        return (
            <Menu mode='inline'
                selectedKeys={this.selectKey()}
                defaultOpenKeys={defaultOpenKeys}
                onOpenChange={this.onOpenChange.bind(this)}>
                {
                    menus.map(menu => {
                        const {key, name, children = [], icon} = menu;
                        if (children.length) {
                            const rst = [];
                            children.forEach(item => {
                                const {key, name, path, disabled, icon, id} = item;
                                const has = permissions.some(permission => permission.FunctionCode === `appmeta.${id}.READ`);
                                if (isSuperuser || has) {
                                    rst.push(
                                        <Item key={key}>
                                            <Link onClick={e => disabled && e.preventDefault()} to={path}>
                                                {/* {icon} */}
                                                {name}
                                            </Link>
                                        </Item>);
                                }
                            });
                            if (rst.length) {
                                return <SubMenu key={key} title={<span>{icon}<span>{name}</span></span>}>
                                    {rst}
                                </SubMenu>;
                            }
                        } else {
                            const {key, name, path, disabled, icon, id} = menu;
                            const has = permissions.some(permission => permission.FunctionCode === `appmeta.${id}.READ`);
                            if (isSuperuser || has) {
                                return (
                                    <Item key={key}>
                                        <Link onClick={e => disabled && e.preventDefault()} to={path}>
                                            {/* {icon} */}
                                            {name}
                                        </Link>
                                    </Item>);
                            }
                        }
                    })
                }
            </Menu>);
    }

    selectKey () {
        const {menus = [], location: {pathname = ''} = {}} = this.props;
        const selectedKeys = [];
        // console.log('menus',menus)

        menus.forEach(menu => {
            const {children = []} = menu;
            if (children.length) {
                const {key = ''} = children.find(menu => menu.path === pathname) || {};
                if (key) selectedKeys.push(key);
            } else {
                if (menu.path === pathname) selectedKeys.push(menu.key);
            }
        });

        // console.log('selectedKeys',selectedKeys)
        return selectedKeys;
    }

    onOpenChange (openKeys) {
        console.log('openKeys', openKeys);
        if (this.props.getOnOpenKeys) {
            this.props.getOnOpenKeys(openKeys);
        }
    }
};
