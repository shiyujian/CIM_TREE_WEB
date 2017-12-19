/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import {air_menus,air_ignoreModules,air_headLogo} from './air/api';
import {qh_menus,qh_ignoreModules,qh_headLogo} from './qh/api';
import {xa_menus,xa_ignoreModules,xa_headLogo} from './xa/api';

let static_menus = [];
let static_ignoreModules = [];
let static_headLogo;

if(__env__ == 'qh'){
	static_menus = qh_menus;
	static_ignoreModules = qh_ignoreModules;
	static_headLogo = qh_headLogo;
}
if(__env__ == 'xa'){
	static_menus = xa_menus;
	static_ignoreModules = xa_ignoreModules;
	static_headLogo = xa_headLogo; 
}
if(__env__ == 'air'){
	static_menus = air_menus;
	static_ignoreModules = air_ignoreModules;
	static_headLogo = air_headLogo;
}

export const loadMenus = static_menus;

export const loadIgnoreModules  = static_ignoreModules;

export const loadHeadLogo = static_headLogo;
