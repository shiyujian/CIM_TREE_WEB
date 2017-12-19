/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, {Component} from 'react';
import {Icon} from 'react-fa';
import headLogo from './logo_head.png';

export const air_headLogo = headLogo;

export const air_menus = [{
		key: 'home',
		id: 'HOME',
		title: '首页',
		path: '/',
		icon: <Icon name="home"/>,
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
}];

export const air_ignoreModules = ['login'];
