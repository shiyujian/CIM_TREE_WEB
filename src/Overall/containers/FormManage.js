import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString from 'query-string';
import reducer, { actions } from '../store/formmanage';
//import PkCodeTree from '../../Quality/components/PkCodeTree';
import { actions as platformActions } from '_platform/store/global';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import { WorkTree, SearchInfo, TableInfo } from '../components/FormManage';
import moment from 'moment';
import { Tabs } from 'antd';
export const Datumcode = window.DeathCode.OVERALL_FORM;


@connect(
    state => {
        const { overall: { formmanage = {} }, platform } = state;
        return { platform, ...formmanage };
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions, ...previewActions }, dispatch),
    }),
)

export default class FormManage extends Component {
    array = [];
    constructor(props) {
        super(props);
        this.state = {
            isTreeSelected: false,
            loading:false
        }
    }
    async componentDidMount() {
        const {actions: {getDir,getPublicUnitList}} = this.props;
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
        console.log('value',value)
        setkeycode(code); 
        if(code === undefined){
            return
        }
        this.setState({isTreeSelected:e.selected})
        setcurrentcode({code:code.split("--")[1]});
        getdocument({code:code.split("--")[1]});
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
            <div>
                <DynamicTitle title="表单管理" {...this.props}/>
                <Sidebar>
                    <WorkTree treeData={list}
                                selectedKeys={keycode}
                                onSelect={this.onSelect.bind(this)}
                                {...this.state}  />
                </Sidebar>
                <Content>
                    <TableInfo {...this.props} array = {this.array}/>
                </Content>
            </div>
        )
    }
}