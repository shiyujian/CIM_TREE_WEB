/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { Icon } from 'react-fa';
import headLogo from './LOGO.png';

export const tree_headLogo = headLogo;

export const tree_footerYear = '2019';

export const tree_footerCompany = '华东工程数字技术有限公司';

export const tree_menus = [
    {
        key: 'home',
        id: 'HOME',
        title: '首页',
        path: '/',
        icon: <Icon name='home' />
    },
    {
        key: 'dashboard',
        id: 'DASHBOARD',
        title: '综合展示',
        path: '/dashboard/onsite',
        icon: <Icon name='map' />
    },
    {
        key: 'overall',
        id: 'OVERALL',
        title: '综合管理',
        path: '/overall/news',
        icon: <Icon name='cubes' />
    },
    {
        key: 'schedule',
        id: 'SCHEDULE',
        title: '进度管理',
        path: '/schedule/stagereport',
        icon: <Icon name='random' />
    },
    {
        key: 'forest',
        id: 'FOREST',
        title: '森林大数据',
        path: '/forest/nursoverallinfo',
        icon: <Icon name='tree' />
    },
    {
        key: 'conservation',
        id: 'CONSERVATION',
        title: '养护管理',
        path: '/conservation/taskcreate',
        icon: <Icon name='map' />
    },
    // {
    //     key: 'market',
    //     id: 'MARKET',
    //     title: '苗木市场',
    //     path: '/market/seedlingsupply',
    //     icon: <Icon name='shopping-cart' />
    // },
    {
        key: 'checkwork',
        id: 'CHECKWORK',
        title: '考勤管理',
        path: '/checkwork/attendancecount',
        icon: <Icon name='print' />
    },
    {
        key: 'selfcare',
        id: 'SELFCARE',
        title: '个人中心',
        path: '/selfcare/task',
        icon: <Icon name='user' />
    },
    {
        key: 'setup',
        id: 'SETUP',
        title: '系统设置',
        path: '/setup/person',
        icon: <Icon name='cogs' />
    },
    {
        key: 'project',
        id: 'PROJECT',
        title: '项目管理',
        path: '/project/nurserymanagement',
        icon: <Icon name='cogs' />
    },
    {
        key: 'dipping',
        id: 'DIPPING',
        title: '三维倾斜',
        path: '/dipping/dipping',
        icon: <Icon name='plane' />
    }
];

export const tree_ignoreModules = ['login'];
