/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import React from 'react';
import {Icon} from 'react-fa';
import headLogo from './logo_head.png';

export const tree_headLogo = headLogo;

export const tree_footerYear = '2018';

export const tree_footerCompany = '华东工程数字技术有限公司';

export const tree_menus = [{
	key: 'home',
	id: 'HOME',
	title: '首页',
	path: '/',
	icon: <Icon name="home"/>,
}, {
	key: 'dashboard',
	id: 'DISPLAY',
	title: '综合展示',
	path: '/dashboard',
	icon: <Icon name="map"/>
}, {
	key: 'overall',
	id: 'MANAGE',
	title: '综合管理',
	path: '/overall/news',
	icon: <Icon name="cubes"/>,
}, {
	key: 'datum',
	id: 'DATUM',
	title: '资料管理',
	path: '/datum',
	icon: <Icon name="book"/>
}, {
	key: 'quality',
	id: 'QUALITY',
	title: '质量管理',
	path: '/quality',
	icon: <Icon name="list-alt"/>
}, {
	key: 'schedule',
	id: 'SCHEDULE',
	title: '进度管理',
	path: '/schedule/stagereport',
	icon: <Icon name="random"/>
}, {
	key: 'safety',
	title: '安环管理',
	id: 'SAFETY',
	path: '/safety',
	icon: <Icon name="shield"/>,
}, {
	key: 'forest',
	id: 'FOREST',
	title: '森林大数据',
	path: '/forest/nursoverallinfo',
	icon: <Icon name="tree"/>,
}, {
	key: 'receive',
	id: 'RECEIVE',
	title: '收发货管理',
	path: '/receive',
	icon: <Icon name="user"/>
}, {
	key: 'selfcare',
	id: 'SELFCARE',
	title: '个人中心',
	path: '/selfcare',
	icon: <Icon name="user"/>
}, {
	key: 'system',
	id: 'SYSTEM',
	title: '系统设置',
	path: '/system',
	icon: <Icon name="cogs"/>
}, {
	key: 'project',
	id: 'PROJECT',
	title: '项目管理',
	path: '/project',
	icon: <Icon name="cogs"/>
}];

export const tree_ignoreModules = ['login'];
