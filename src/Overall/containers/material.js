import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import reducer, {actions} from '../store/material';
//import PkCodeTree from '../../Quality/components/PkCodeTree';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Filter, Table,Addition,Updatemodal,DatumTree,ResourceFilter,ResourceTable,ResourceAddition} from '../components/Material';
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

    render() {
        const {
            platform: {
                dir:{
                    list = []
                } = {}
            } = {},
            keycode
        } = this.props;
        return (
            <Body>
            <Main>
                <DynamicTitle title="制度标准" {...this.props}/>
                <Sidebar>
                    <DatumTree treeData={list}
                                selectedKeys={keycode}
                                onSelect={this.onSelect.bind(this)}
                                {...this.state}/>
                </Sidebar>
                <Content>
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="机械设备" key="1">
                            <Filter  {...this.props} {...this.state}/>
                            <Table {...this.props}/>
                            <Addition {...this.props}/>
                        </TabPane>
                        <TabPane tab="工程材料" key="2">
                            <ResourceFilter  {...this.props} {...this.state}/>
                            <ResourceTable {...this.props}/>
                            <ResourceAddition {...this.props}/>
                        </TabPane>
                        <TabPane tab="苗木资料" key="3">
                            <ResourceFilter  {...this.props} {...this.state}/>
                            <ResourceTable {...this.props}/>
                            <ResourceAddition {...this.props}/>
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
