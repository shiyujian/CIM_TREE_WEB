import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import reducer, {actions} from '../store/material';
//import PkCodeTree from '../../Quality/components/PkCodeTree';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {GeneralFilter, GeneralTable,Updatemodal,DatumTree,ResourceFilter,ResourceTable,SeedingFilter,SeedingTable} from '../components/Material';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import moment from 'moment';
import {Tabs} from 'antd';
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
            loading:false
        }
    }
    //Tab栏的切换
    tabChange(tabValue) {
        const {actions: {setTabActive}} = this.props;
        setTabActive(tabValue);
    }

    render() {
        const {
            platform: {
                dir:{
                    list = []
                } = {}
            } = {},
            Doc=[],
            keycode,
            tabValue = '1',
        } = this.props;
        console.log('material',this.props.Doc)
        return (
            <Body>
            <Main>
                <DynamicTitle title="物资管理" {...this.props}/>
                <Sidebar>
                    <DatumTree treeData={list}
                                selectedKeys={keycode}
                                onSelect={this.onSelect.bind(this)}
                                {...this.state}/>
                </Sidebar>
                <Content>
                    <Tabs activeKey={tabValue} onChange={this.tabChange.bind(this)} >
                        <TabPane tab="机械设备" key="1">
                            {/* <GeneralFilter  {...this.props} {...this.state}/> */}
                            <GeneralTable {...this.props} {...this.state}/>
                        </TabPane>
                        <TabPane tab="工程材料" key="2">
                            {/* <ResourceFilter  {...this.props} {...this.state}/> */}
                            <ResourceTable {...this.props} {...this.state}/>
                        </TabPane>
                        <TabPane tab="苗木资料" key="3">
                            {/* <SeedingFilter  {...this.props} {...this.state}/> */}
                            <SeedingTable {...this.props} {...this.state}/>
                        </TabPane>
                    </Tabs>
                </Content>
            </Main>
            <Preview/>
            </Body>
        );
    }

    componentDidMount() {
        const {actions: {getDir}} = this.props;
        this.setState({loading:true});
        getDir({code:Datumcode}).then(({children}) => {
            this.setState({loading:false});
        });
        if(this.props.Doc){
            this.setState({isTreeSelected:true})
        }
    }

    onSelect(value = [],e) {
        const [code] = value;
        const {actions:{getdocument,setcurrentcode,setkeycode}} =this.props;
        setkeycode(code);
        if(code === undefined){
            return
        }
        this.setState({isTreeSelected:e.selected})
        setcurrentcode({code:code.split("--")[1]});
        getdocument({code:code.split("--")[1]});
    }
}
