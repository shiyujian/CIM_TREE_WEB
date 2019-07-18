/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2019-07-18 09:44:12
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2019-07-18 09:44:52
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
 * @Date: 2019-07-18 09:44:07
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2019-07-18 09:44:07
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
 * @Date: 2018-09-25 10:51:59
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2019-04-29 14:52:04
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
            TreeAdoptInfo = null,
            UserAnalysis = null,
            UserAnalysi = null,
            NurserySourseAnalysi = null,
            EnterStrengthAnalysi = null,
            PlantStrengthAnalysi = null,
            DegitalAccept = null,
            TreeDataClear = null
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
                    {TreeAdoptInfo && (
                        <Route
                            path='/forest/treeadoptinfo'
                            component={TreeAdoptInfo}
                        />
                    )}
                    {DataStatis && (
                        <Route
                            path='/forest/datastatis'
                            component={DataStatis}
                        />
                    )}
                    {UserAnalysis && (
                        <Route
                            path='/forest/useranalysis'
                            component={UserAnalysis}
                        />
                    )}
                    {UserAnalysi && (
                        <Route
                            path='/forest/useranalysi'
                            component={UserAnalysi}
                        />
                    )}
                    {NurserySourseAnalysi && (
                        <Route
                            path='/forest/nurserysourseanalysi'
                            component={NurserySourseAnalysi}
                        />
                    )}
                    {EnterStrengthAnalysi && (
                        <Route
                            path='/forest/enterstrengthanalysi'
                            component={EnterStrengthAnalysi}
                        />
                    )}
                    {PlantStrengthAnalysi && (
                        <Route
                            path='/forest/plantstrengthanalysi'
                            component={PlantStrengthAnalysi}
                        />
                    )}
                    {DegitalAccept && (
                        <Route
                            path='/forest/degitalaccept'
                            component={DegitalAccept}
                        />
                    )}
                    {TreeDataClear && (
                        <Route
                            path='/forest/treedataclear'
                            component={TreeDataClear}
                        />
                    )}
                </Main>
            </Body>
        );
    }

    static menus = [
        {
            key: 'nursoverallinfo',
            id: 'FOREST.NURSOVERALLINFO',
            path: '/forest/nursoverallinfo',
            name: '苗木综合信息'
        },
        {
            key: 'statis',
            id: 'FOREST.STATIS',
            name: '统计图表',
            children: [
                {
                    key: 'useranalysi',
                    id: 'FOREST.USERANALYSI',
                    path: '/forest/useranalysi',
                    name: '用户分析'
                },
                {
                    key: 'nurserysourseanalysi',
                    id: 'FOREST.NURSERYSOURSEANALYSI',
                    path: '/forest/nurserysourseanalysi',
                    name: '苗木来源地分析'
                },
                {
                    key: 'enterstrengthanalysi',
                    id: 'FOREST.ENTERSTRENGTHANALYSI',
                    path: '/forest/enterstrengthanalysi',
                    name: '进场强度分析'
                },
                {
                    key: 'plantstrengthanalysi',
                    id: 'FOREST.PLANTSTRENGTHANALYSI',
                    path: '/forest/plantstrengthanalysi',
                    name: '栽植强度分析'
                },
                {
                    key: 'datastatis',
                    id: 'FOREST.DATASTATIS',
                    path: '/forest/datastatis',
                    name: '数据统计'
                },
                {
                    key: 'useranalysis',
                    id: 'FOREST.USERANALYSIS',
                    path: '/forest/useranalysis',
                    name: '用户行为统计'
                }
            ]
        },
        {
            key: 'building',
            id: 'FOREST.BUILDING',
            name: '建设期信息',
            children: [
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
                }
            ]
        },
        {
            key: 'management',
            id: 'FOREST.MANAGEMENT',
            name: '养管护信息',
            children: [
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
                    name: '苗木状态信息'
                }
            ]
        },
        {
            key: 'import',
            id: 'FOREST.IMPORT',
            name: '数据信息维护',
            children: [
                {
                    key: 'seedlingschange',
                    id: 'FOREST.SEEDLINGSCHANGE',
                    path: '/forest/seedlingschange',
                    name: '苗木信息修改'
                },
                {
                    key: 'treedataclear',
                    id: 'FOREST.TREEDATACLEAR',
                    path: '/forest/treedataclear',
                    name: '苗木信息删除'
                },
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
            key: 'degitalaccept',
            id: 'FOREST.DEGITALACCEPT',
            path: '/forest/degitalaccept',
            name: '数字化验收'
        }
    ];
    static defaultOpenKeys = [''];
}
