import React, { Component } from 'react';
import { DynamicTitle, Content, Sidebar } from '_platform/components/layout';
import { getUser } from '_platform/auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import './Schedule.less';
import { Link } from 'react-router-dom';
import { WORKFLOW_CODE } from '_platform/api';
import queryString from 'query-string';
import { Stagereporttab, All, Plan } from '../components/stagereport';
import { PkCodeTree, Cards } from '../components';
import { actions as platformActions } from '_platform/store/global';
import * as previewActions from '_platform/store/global/preview';
import reducer, { actions } from '../store/stage';

import {
    Row, Col, Spin, Card, DatePicker, Upload, Icon, notification, message,
    Input, Button, Modal, Table, Form, Select, Radio, Calendar, Checkbox, Popover, Tabs
} from 'antd';
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const { Option } = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

@connect(
    state => {
        const { schedule: { stage = {} }, platform } = state;
        return { platform, ...stage };
    },
    dispatch => ({
        actions: bindActionCreators({ ...platformActions, ...previewActions, ...actions }, dispatch)
    })
)

export default class Stage extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);
        this.state = {
            treetypeoption: [],
            treetyoption: [],
            treetypelist: [],
            treeLists: [],
            sectionoption: [],
            leftkeycode: '',
        };
    }

    componentDidMount() {
        const {actions: {getTreeList,getTreeNodeList,gettreetype,getProjectList}, treetypes,platform:{tree = {}}} = this.props; 
    
        if(!tree.projectList){
            getProjectList()
        }
        this.setState({
            leftkeycode:"P009"
        })
        //类型
        let treetyoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={'1'}>常绿乔木</Option>,
            <Option key={'2'} value={'2'}>落叶乔木</Option>,
            <Option key={'3'} value={'3'}>亚乔木</Option>,
            <Option key={'4'} value={'4'}>灌木</Option>,
            <Option key={'5'} value={'5'}>草本</Option>,
        ];
        this.setState({ treetyoption })
    }

    render() {
        const { keycode } = this.props;
        const {
            treetypeoption,
            treetypelist,
            treetyoption,
            sectionoption,
            leftkeycode,
        } = this.state;
        const {platform:{tree={}}} = this.props;
        let treeList = [];
        if(tree.projectList){
            treeList = tree.projectList
        }
        console.log('tree',tree)
        return (
            <div>
                <DynamicTitle title="进度填报" {...this.props} />
                <Sidebar>
                    <div style={{ overflow: 'hidden' }} className="project-tree">
                        <PkCodeTree treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            // onExpand={this.onExpand.bind(this)} 
                            />
                    </div>
                </Sidebar>
                <Content>
                    <div>
                        <Tabs>
                            <TabPane tab="总计划进度" key="1">
                                <All {...this.props} {...this.state}/>
                            </TabPane>
                            <TabPane tab="每日计划进度" key="2">
                                <Plan {...this.props } {...this.state}/>
                            </TabPane>
                            <TabPane tab="每日实际进度" key="3">
                                <Stagereporttab {...this.props} {...this.state}/>
                            </TabPane>
                        </Tabs>
                    </div>
                </Content>
            </div>);
    }

   

    //树选择
    onSelect(value = []) {
        console.log('stagestage选择的树节点',value)
        let keycode = value[0] || '';
        const { actions: { getTreeList, gettreetype } } = this.props;
        this.setState({ leftkeycode: keycode })
    }
}

//连接树children
function getNewTreeData(treeData, curKey, child) {
    const loop = (data) => {
        data.forEach((item) => {
            if (curKey == item.No) {
                item.children = child;
            } else {
                if (item.children)
                    loop(item.children);
            }
        });
    };
    try {
        loop(treeData);
    } catch (e) {
        console.log(e)
    }
}
