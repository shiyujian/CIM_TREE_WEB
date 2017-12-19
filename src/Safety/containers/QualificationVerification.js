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
import reducer,  {actions} from '../store/qualificationVerification';
//import cookie from 'component-cookie';
import {actions as platformActions} from '_platform/store/global';
import { actions as fileActions } from '../store/staticFile';
import { actions as supportActions } from '../store/supportActions';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Table, Button, Row, Col, Icon, Modal, Input, message,Tabs,
    notification, DatePicker, Select, InputNumber, Form, Upload, Card} from 'antd';
// import {ProjectTree}from '../components/Register';
import WorkPackageTree from '../components/WorkPackageTree';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
//import Tab from '../components/QualificationVerification/QTab';
import Qualification from '../components/QualificationVerification/Qualification';
import ExaminationCard from '../components/QualificationVerification/ExaminationCard';
import JobCard from '../components/QualificationVerification/JobCard';
import {SOURCE_API, STATIC_DOWNLOAD_API} from '_platform/api';
import './Register.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Option = Select.Option;
const TabPane = Tabs.TabPane;

@connect(
	state => {
		const {safety: {qualificationVerification = {}} = {}, platform} = state;
		return {...qualificationVerification, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions, ...previewActions,...fileActions,...supportActions}, dispatch)
	})
)

export default class QualificationVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code:'',
            pcode:''
        };
    }
    componentDidMount() {
        
    }
    callback(key) {
        console.log(key);
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
        console.log('register props',this.props);

        return (
            <div>
                <DynamicTitle title="安全资质验证" {...this.props} />
                <Sidebar>
                    <WorkPackageTree {...this.props} onSelect={this.onTreeNodeClick.bind(this)}/>
                </Sidebar>
                <Content>
                    <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
                        <TabPane tab="总包/分包单位资质" key="1">
                            <Qualification {...this.props}  code={this.state.code} pcode={this.state.pcode}/>
                        </TabPane>
                        <TabPane tab="三类人员考核证" key="2">
                            <ExaminationCard {...this.props}  code={this.state.code} pcode={this.state.pcode}/>
                        </TabPane>
                        <TabPane tab="特殊工种上岗证" key="3">
                            <JobCard {...this.props}  code={this.state.code} pcode={this.state.pcode}/>
                        </TabPane>
                    </Tabs>
                </Content>
                <Preview />
            </div>
            
        );
    }
}


