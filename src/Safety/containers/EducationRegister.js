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
import reducer,  {actions} from '../store/educationRegister';
//import cookie from 'component-cookie';
import {actions as platformActions} from '_platform/store/global';
import { actions as fileActions } from '../store/staticFile';
import { actions as supportActions } from '../store/supportActions';
import {Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Table, Button, Row, Col, Icon, Modal, Input, message,Tabs,
    notification, DatePicker, Select, InputNumber, Form, Upload, Card} from 'antd';
// import {ProjectTree}from '../components/Register';
import WorkPackageTree from '../components/WorkPackageTree';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
// import Tab from '../components/EducationRegister/ETab';
import Level3 from '../components/EducationRegister/Level3';
import Worker from '../components/EducationRegister/Worker';
import Manager from '../components/EducationRegister/Manager';
import {SOURCE_API, STATIC_DOWNLOAD_API} from '_platform/api';
import './Register.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Option = Select.Option;
const TabPane = Tabs.TabPane;


@connect(
	state => {
		const {safety: {educationRegister = {}} = {}, platform} = state;
		return {...educationRegister, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions, ...previewActions,...fileActions,...supportActions}, dispatch)
	})
)

export default class EducationRegister extends Component {
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
        console.log('selectedKeys', selectedKeys, e)
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
                <DynamicTitle title="安全教育" {...this.props} />
                <Sidebar>
                    <WorkPackageTree {...this.props} onSelect={this.onTreeNodeClick.bind(this)}/>
                </Sidebar>
                <Content>
                    <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
                        <TabPane tab="入场三级安全教育" key="1">
                            <Level3 {...this.props} code={this.state.code} pcode={this.state.pcode}/>
                        </TabPane>
                        <TabPane tab="作业人员安全教育" key="2">
                            <Worker {...this.props} code={this.state.code} pcode={this.state.pcode}/>
                        </TabPane>
                        <TabPane tab="管理人员安全教育" key="3">
                            <Manager {...this.props} code={this.state.code} pcode={this.state.pcode}/>
                        </TabPane>
                    </Tabs>
                </Content>
            </div>
            
        );
    }
}


