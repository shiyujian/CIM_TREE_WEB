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
import reducer,  {actions} from '../store/actionsRecord';
//import cookie from 'component-cookie';
import {actions as platformActions} from '_platform/store/global';
import { actions as fileActions } from '../store/staticFile';
import { actions as supportActions } from '../store/supportActions';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Table, Button, Row, Col, Icon, Modal, Input, message, Tabs,
    notification, DatePicker, Select, InputNumber, Form, Upload, Card} from 'antd';
// import {ProjectTree}from '../components/Register';
import WorkPackageTree from '../components/WorkPackageTree';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
//import Tab from '../components/ActionsRecord/ATab';
import SafeDiary from '../components/ActionsRecord/SafeDiary';
import ActionRecord from '../components/ActionsRecord/ActionRecord';
import {SOURCE_API, STATIC_DOWNLOAD_API} from '_platform/api';
import './Register.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Option = Select.Option;
const TabPane = Tabs.TabPane;

@connect(
	state => {
		const {safety: {actionsRecord = {}} = {}, platform} = state;
		return {...actionsRecord, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions, ...previewActions, ...fileActions, ...supportActions}, dispatch)
	})
)

export default class ActionsRecord extends Component {
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
        return (
            <div>
                <DynamicTitle title="安全活动记录" {...this.props} />
                <Sidebar>
                    <WorkPackageTree {...this.props} onSelect={this.onTreeNodeClick.bind(this)} />
                </Sidebar>
                <Content>
                    <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
                        <TabPane tab="施工安全日记" key="1">
                            <SafeDiary  {...this.props} code={this.state.code} pcode={this.state.pcode}/>
                        </TabPane>
                        <TabPane tab="班组班前活动记录" key="2">
                            <ActionRecord {...this.props} code={this.state.code} pcode={this.state.pcode}/>
                        </TabPane>
                    </Tabs>
                </Content>
            </div>
            
        );
    }
}


