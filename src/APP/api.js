/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
*
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/

import {tree_menus, tree_ignoreModules, tree_headLogo, tree_footerYear, tree_footerCompany} from './tree/api';

let static_menus = [];
let static_ignoreModules = [];
let static_headLogo;
let static_footerYear = '2019';
let static_footerCompany = '华东工程数字技术有限公司';

if (__env__ == 'tree') {
    static_menus = tree_menus;
    static_ignoreModules = tree_ignoreModules;
    static_headLogo = tree_headLogo;
    static_footerYear = tree_footerYear;
    static_footerCompany = tree_footerCompany;
}
export const loadMenus = static_menus;

export const loadIgnoreModules = static_ignoreModules;

export const loadHeadLogo = static_headLogo;

export const loadFooterCompany = static_footerCompany;

export const loadFooterYear = static_footerYear;
