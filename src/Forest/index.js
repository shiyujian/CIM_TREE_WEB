/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-09-25 10:51:59
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-09-25 11:03:29
 */
/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-09-01 16:58:31
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-09-03 09:22:59
 */
import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import { Icon } from 'react-fa';

export default class ForestContainer extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('forest', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        const {
            Nursoverallinfo = null,
            Nursmeasureinfo = null,
            Locmeasureinfo = null,
            Supervisorinfo = null,
            Checkerinfo = null,
            Faithinfo = null,
            Faithanalyze = null,
            Qualityanalyze = null,
            Enteranalyze = null,
            Scheduleanalyze = null,
            Dataimport = null,
            Contrastinfo = null,
            CarPackage = null,
            DataExport = null,
            SeedlingsChange = null,
            CuringInfo = null,
            DataStatis = null,
            TreeAdoptInfo = null
        } = this.state || {};
        return (
            <Body>
                <Aside>
                    <Submenu
                        {...this.props}
                        menus={ForestContainer.menus}
                        defaultOpenKeys={ForestContainer.defaultOpenKeys}
                    />
                </Aside>
                <Main>
                    {Nursoverallinfo && (
                        <Route
                            path='/forest/nursoverallinfo'
                            component={Nursoverallinfo}
                        />
                    )}
                    {Nursmeasureinfo && (
                        <Route
                            path='/forest/nursmeasureinfo'
                            component={Nursmeasureinfo}
                        />
                    )}
                    {CarPackage && (
                        <Route
                            path='/forest/carpackage'
                            component={CarPackage}
                        />
                    )}
                    {Locmeasureinfo && (
                        <Route
                            path='/forest/locmeasureinfo'
                            component={Locmeasureinfo}
                        />
                    )}
                    {Supervisorinfo && (
                        <Route
                            path='/forest/supervisorinfo'
                            component={Supervisorinfo}
                        />
                    )}
                    {Checkerinfo && (
                        <Route
                            path='/forest/checkerinfo'
                            component={Checkerinfo}
                        />
                    )}
                    {Faithinfo && (
                        <Route path='/forest/faithinfo' component={Faithinfo} />
                    )}
                    {Faithanalyze && (
                        <Route
                            path='/forest/faithanalyze'
                            component={Faithanalyze}
                        />
                    )}
                    {Qualityanalyze && (
                        <Route
                            path='/forest/qualityanalyze'
                            component={Qualityanalyze}
                        />
                    )}
                    {Enteranalyze && (
                        <Route
                            path='/forest/enteranalyze'
                            component={Enteranalyze}
                        />
                    )}
                    {Scheduleanalyze && (
                        <Route
                            path='/forest/scheduleanalyze'
                            component={Scheduleanalyze}
                        />
                    )}
                    {Dataimport && (
                        <Route
                            path='/forest/dataimport'
                            component={Dataimport}
                        />
                    )}
                    {DataExport && (
                        <Route
                            path='/forest/dataexport'
                            component={DataExport}
                        />
                    )}
                    {Contrastinfo && (
                        <Route
                            path='/forest/contrastinfo'
                            component={Contrastinfo}
                        />
                    )}
                    {SeedlingsChange && (
                        <Route
                            path='/forest/seedlingschange'
                            component={SeedlingsChange}
                        />
                    )}
                    {CuringInfo && (
                        <Route
                            path='/forest/curinginfo'
                            component={CuringInfo}
                        />
                    )}
                    {DataStatis && (
                        <Route
                            path='/forest/datastatis'
                            component={DataStatis}
                        />
                    )}
                    {TreeAdoptInfo && (
                        <Route
                            path='/forest/treeadoptinfo'
                            component={TreeAdoptInfo}
                        />
                    )}
                </Main>
            </Body>
        );
    }

    static menus = [
        {
            key: 'info',
            id: 'FOREST.INFO',
            name: '苗木大数据',
            children: [
                {
                    key: 'nursoverallinfo',
                    id: 'FOREST.NURSOVERALLINFO',
                    path: '/forest/nursoverallinfo',
                    name: '苗木综合信息'
                },
                {
                    key: 'nursmeasureinfo',
                    id: 'FOREST.NURSMEASUREINFO',
                    path: '/forest/nursmeasureinfo',
                    name: '苗圃测量信息'
                },
                {
                    key: 'carpackage',
                    id: 'FOREST.CARPACKAGE',
                    path: '/forest/carpackage',
                    name: '车辆打包信息'
                },
                {
                    key: 'locmeasureinfo',
                    id: 'FOREST.LOCMEASUREINFO',
                    path: '/forest/locmeasureinfo',
                    name: '现场测量信息'
                },
                {
                    key: 'supervisorinfo',
                    id: 'FOREST.SUPERVISORINFO',
                    path: '/forest/supervisorinfo',
                    name: '监理抽查信息'
                },
                {
                    key: 'ownerinfo',
                    id: 'FOREST.OWNERINFO',
                    path: '/forest/checkerinfo',
                    name: '业主抽查信息'
                },
                {
                    key: 'contrastinfo',
                    id: 'FOREST.CONTRASTINFO',
                    path: '/forest/contrastinfo',
                    name: '苗木对比信息'
                },
                {
                    key: 'faithinfo',
                    id: 'FOREST.FAITHINFO',
                    path: '/forest/faithinfo',
                    name: '供应商诚信信息'
                },
                {
                    key: 'seedlingschange',
                    id: 'FOREST.SEEDLINGSCHANGE',
                    path: '/forest/seedlingschange',
                    name: '苗木信息修改'
                },
                {
                    key: 'curinginfo',
                    id: 'FOREST.CURINGINFO',
                    path: '/forest/curinginfo',
                    name: '养护信息'
                },
                {
                    key: 'treeadoptinfo',
                    id: 'FOREST.TREEADOPTINFO',
                    path: '/forest/treeadoptinfo',
                    name: '苗木结缘信息'
                }
            ]
        },
        // {
        // 	key: 'analyze',
        // 	id: 'FOREST.ANALYZE',
        // 	name: '数据分析',
        // 	children: [{
        // 		key: 'enteranalyze',
        // 		id: 'ENTERANALYZE',
        // 		path: '/forest/enteranalyze',
        // 		name: '苗木进场分析',
        // 	},{
        // 		key: 'scheduleanalyze',
        // 		id: 'SCHEDULEANALYZE',
        // 		path: '/forest/scheduleanalyze',
        // 		name: '种植进度分析',
        // 	},{
        // 		key: 'qualityanalyze',
        // 		id: 'QUALITYANALYZE',
        // 		path: '/forest/qualityanalyze',
        // 		name: '种植质量分析',
        // 	},{
        // 		key: 'faithanalyze',
        // 		id: 'FAITHANALYZE',
        // 		path: '/forest/faithanalyze',
        // 		name: '诚信供应商分析',
        // 	}
        // 	]
        // },
        {
            key: 'import',
            id: 'FOREST.IMPORT',
            name: '定位数据信息',
            children: [
                {
                    key: 'dataimport',
                    id: 'FOREST.DATAIMPORT',
                    path: '/forest/dataimport',
                    name: '定位数据导入'
                },
                {
                    key: 'dataexport',
                    id: 'FOREST.DATAEXPORT',
                    path: '/forest/dataexport',
                    name: '定位数据导出'
                }
            ]
        },
        {
            key: 'datastatis',
            id: 'FOREST.DATASTATIS',
            path: '/forest/datastatis',
            name: '数据统计'
        }
    ];
    static defaultOpenKeys = ['info', 'analyze', 'import'];
}
