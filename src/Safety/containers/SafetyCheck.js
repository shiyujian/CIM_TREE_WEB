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
import reducer,  {actions} from '../store/safetyCheck';
//import cookie from 'component-cookie';
import {actions as platformActions} from '_platform/store/global';
import { actions as fileActions } from '../store/staticFile';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Table, Button, Row, Col, Icon, Modal, Input, message,Calendar,Tabs,
    notification, DatePicker, Select, InputNumber, Form, Upload, Card,Popconfirm} from 'antd';
// import {ProjectTree}from '../components/Register';
import WorkPackageTree from '../components/WorkPackageTree';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import AddScheduler from '../components/SafetyCheck/AddScheduler';
import EditRating from '../components/SafetyCheck/EditRating';
import AddRating from '../components/SafetyCheck/AddRating';
import CheckForm from '../components/SafetyCheck/CheckForm';
import CheckPlan from '../components/SafetyCheck/CheckPlan';
import CheckRecord from '../components/SafetyCheck/CheckRecord';
import { actions as supportActions } from '../store/supportActions';
import {SOURCE_API, STATIC_DOWNLOAD_API} from '_platform/api';
import './Register.css';
import moment from 'moment';
moment.locale('zh-cn');
const Option = Select.Option;
const TabPane = Tabs.TabPane;

@connect(
  state => {
    const {safety: {safetyCheck = {}} = {}, platform} = state;
    return {...safetyCheck, platform}
  },
  dispatch => ({
    actions: bindActionCreators({...actions, ...platformActions, ...previewActions,...fileActions,...supportActions}, dispatch)
  })
)

export default class SafetyCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code:'',
            pcode:''
        };
    }

    //点击树事件
    onTreeNodeClick(selectedKeys,e){
        if(!selectedKeys.length){
            this.setState({code:"",pcode:""})
            return
        }
        let node = e.selectedNodes[0].props;
        if(!node.pk){
            this.setState({code:"",pcode:node.dataRef.key})
        }else{
            this.setState({code:node.dataRef.key})            
        }
    }
    render() {
        return (
            <div>
                <DynamicTitle title="安全检查" {...this.props}/>
                <Sidebar>
                    <WorkPackageTree {...this.props} onSelect={this.onTreeNodeClick.bind(this)}/>
        </Sidebar>
                <Content>
                    <Tabs type="card" defaultActiveKey="1">
                        <TabPane tab="安全检查用表" key="1">
                            <CheckForm {...this.props}  code={this.state.code} pcode={this.state.pcode}/>
                        </TabPane>
                        <TabPane tab="安全检查计划" key="2">
                            <CheckPlan {...this.props}  code={this.state.code} pcode={this.state.pcode}/>
                        </TabPane>
                        <TabPane tab="安全检查记录" key="3">
                            <CheckRecord {...this.props}  code={this.state.code} pcode={this.state.pcode}/>
                        </TabPane>
                    </Tabs>
                </Content>
            </div>
            
        );
    }
}
