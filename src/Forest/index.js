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
 * @Last Modified time: 2019-10-21 15:20:18
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
import {ForestMenu} from '_platform/MenuJson';

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
            Faithanalyze = null,
            Qualityanalyze = null,
            Enteranalyze = null,
            Scheduleanalyze = null,
            Dataimport = null,
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
            TreeDataClear = null,
            DieTrees = null
        } = this.state || {};
        return (
            <Body>
                <Aside>
                    <Submenu
                        {...this.props}
                        menus={ForestMenu}
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
                    {DieTrees && (
                        <Route
                            path='/forest/dietrees'
                            component={DieTrees}
                        />
                    )}
                </Main>
            </Body>
        );
    }

    static defaultOpenKeys = [''];
}
