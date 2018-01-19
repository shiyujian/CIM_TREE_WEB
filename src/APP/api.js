/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import {air_menus,air_ignoreModules,air_headLogo,air_footerYear,air_footerCompany} from './air/api';
import {qh_menus,qh_ignoreModules,qh_headLogo,qh_footerYear,qh_footerCompany} from './qh/api';
import {xa_menus,xa_ignoreModules,xa_headLogo,xa_footerYear,xa_footerCompany} from './xa/api';
import {tree_menus,tree_ignoreModules,tree_headLogo,tree_footerYear,tree_footerCompany} from './tree/api';

let static_menus = [];
let static_ignoreModules = [];
let static_headLogo;
let static_footerYear = '2018';
let static_footerCompany = '华东工程数字技术有限公司';


if(__env__ == 'qh'){
	static_menus = qh_menus;
	static_ignoreModules = qh_ignoreModules;
	static_headLogo = qh_headLogo;
	static_footerYear = qh_footerYear;
	static_footerCompany = qh_footerCompany;
}
if(__env__ == 'xa'){
	static_menus = xa_menus;
	static_ignoreModules = xa_ignoreModules;
	static_headLogo = xa_headLogo;
	static_footerYear = xa_footerYear;
	static_footerCompany = xa_footerCompany;
}
if(__env__ == 'air'){
	static_menus = air_menus;
	static_ignoreModules = air_ignoreModules;
	static_headLogo = air_headLogo;
	static_footerYear = air_footerYear;
	static_footerCompany = air_footerCompany;
}

if(__env__ == 'tree'){
	static_menus = tree_menus;
	static_ignoreModules = tree_ignoreModules;
	static_headLogo = tree_headLogo;
	static_footerYear = tree_footerYear;
	static_footerCompany = tree_footerCompany;
}
export const loadMenus = static_menus;

export const loadIgnoreModules  = static_ignoreModules;

export const loadHeadLogo = static_headLogo;

export const loadFooterCompany = static_footerCompany;

export const loadFooterYear = static_footerYear;
