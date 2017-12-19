 /**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 * 
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import reducer,  {actions} from '../store/safetyRules';
//import cookie from 'component-cookie';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Table, Button, Row, Col, Icon, Modal, Input, message,
    notification, DatePicker, Select, InputNumber, Form, Upload, Card} from 'antd';
// import {ProjectTree}from '../components/Register';
import WorkPackageTree from '../components/WorkPackageTree';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import {SOURCE_API, STATIC_DOWNLOAD_API} from '_platform/api';
import './Register.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Option = Select.Option;

@connect(
	state => {
		const {safety: {safetyRules = {}} = {}, platform} = state;
		return {...safetyRules, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions, ...previewActions}, dispatch)
	})
)

export default class SafetyRules extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        
    }
    render() {
        return (
            <div>
                <DynamicTitle title="安全规程" {...this.props}/>
                <Sidebar>
                    <WorkPackageTree {...this.props}/>
				</Sidebar>
                <Content>
                    <div >
                    安全规程
                    </div>
                </Content>
            </div>
            
        );
    }
}


