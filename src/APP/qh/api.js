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

export const qh_headLogo = headLogo;

export const qh_footerYear = '2018';

export const qh_footerCompany = '华东工程数字技术有限公司';

export const qh_menus = [{
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
	key: 'design',
	id: 'DESIGN',
	title: '设计管理',
	path: '/design',
	icon: <Icon name="edit"/>,
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
	path: '/schedule',
	icon: <Icon name="random"/>
}, {
	key: 'safety',
	title: '安全管理',
	id: 'SAFETY',
	path: '/safety',
	icon: <Icon name="shield"/>,
}, {
	key: 'cost',
	title: '造价管理',
	path: '/cost',
	icon: <Icon name="jpy"/>
}, {
	key: 'video',
	title: '三维全景',
	id: 'VIDEO',
	path: '/video/monitor',
	icon: <Icon name="video-camera"/>
},{
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
	key: 'setup',
	id: 'SETUP',
	title: '系统管理',
	path: '/setup',
	icon: <Icon name="gear"/>
},{
	key: 'data',
	id: 'DATA',
	title: '数据报送',
	path: '/data',
	icon: <Icon name="gear"/>
},{
	key: 'summary',
	id: 'SUMMARY',
	title: '汇总分析',
	path: '/summary',
	icon: <Icon name="area-chart"/>
}];

export const qh_ignoreModules = ['login'];
