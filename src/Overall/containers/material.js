import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import reducer, {actions} from '../store/material';
//import PkCodeTree from '../../Quality/components/PkCodeTree';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {GeneralFilter, GeneralTable,Updatemodal,ResourceFilter,ResourceTable,SeedingFilter,SeedingTable} from '../components/Material';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import moment from 'moment';
import {Tabs} from 'antd';
import PkCodeTree  from '../components/PkCodeTree';
import {SeedingAddition,GeneralAddition,ResourceAddition} from '../components/Material'
export const Datumcode = window.DeathCode.OVERALL_MATERIAL;

const TabPane=Tabs.TabPane;

@connect(
    state => {
        const {overall:{material = {}},  platform} = state || {};
        return {...material, platform};
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions,...previewActions}, dispatch)
    })
)
export default class Material extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTreeSelected: false,
            loading:false,
            leftkeycode: '',
        }
    }

    async componentDidMount() {
        const {actions: {getScheduleTaskList}, platform:{tree = {}}} = this.props; 
    
        if(!tree.scheduleTaskList){
            let data = await getScheduleTaskList()
            if(data && data instanceof Array && data.length>0){
                data = data[0]
                let leftkeycode = data.No? data.No :''
                this.setState({
                    leftkeycode
                })
            }
        }
    }

    //Tab栏的切换
    tabChange(tabValue) {
        const {actions: {setTabActive}} = this.props;
        setTabActive(tabValue);
    }

    render() {
        const {
            leftkeycode,
        } = this.state;
        const {
            platform:{tree={}},
            tabValue = '1'
        } = this.props;
        let treeList = [];
        if(tree.scheduleTaskList){
            treeList = tree.scheduleTaskList
        }
        console.log('tree',tree)
        return (
            <Body>
            <Main>
                <DynamicTitle title="物资管理" {...this.props}/>
                <Sidebar>
                    <div style={{ overflow: 'hidden' }} className="project-tree">
                        <PkCodeTree treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            />
                    </div>
                </Sidebar>
                <Content>
                    <Tabs activeKey={tabValue} onChange={this.tabChange.bind(this)} >
                        <TabPane tab="机械设备" key="1">
                            <GeneralTable {...this.props} {...this.state}/>
                            <GeneralAddition {...this.props} {...this.state}/>
                        </TabPane>
                        <TabPane tab="工程材料" key="2">
                            <ResourceTable {...this.props} {...this.state}/>
                            <ResourceAddition {...this.props} {...this.state}/>
                        </TabPane>
                        <TabPane tab="苗木材料" key="3">
                            <SeedingTable {...this.props} {...this.state}/>
                            <SeedingAddition {...this.props} {...this.state}/>
                        </TabPane>
                    </Tabs>
                </Content>
            </Main>
            <Preview/>
            </Body>
        );
    }

    //树选择
    onSelect(value = []) {
        console.log('MaterialMaterial选择的树节点',value)
        let keycode = value[0] || '';
        this.setState({ leftkeycode: keycode })
    }
}
