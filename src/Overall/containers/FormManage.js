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
import { WorkTree, SearchInfo, TableInfo,FormAddition } from '../components/FormManage';
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
            loading:false,
            selectedDir:'',
            depth:''
        }
    }
    async componentDidMount() {
        const {actions: {getTree}} = this.props;
        this.setState({loading:true});
        getTree({code:Datumcode}).then(({children}) => {
            this.setState({loading:false});
        });
        if(this.props.Doc){
            this.setState({isTreeSelected:true})
        }
		
    }

    onSelect(value = [],data) {
        const [code] = value;
        const {actions:{getdocument,setcurrentcode,setkeycode}} =this.props;
        console.log('value',value)
        console.log('data',data)
        setkeycode(code); 
        this.setState({
            isTreeSelected:data.selected
        })
        if(code === undefined){
            return
        }

        if(value && value.length){
			let arr = value[0].split('--')
			let depth = arr[2]
			this.setState({
				depth:depth
			})
		}
        let selectedDir = data.node.props.data
        this.setState({
            selectedDir
        })

        setcurrentcode({code:code.split("--")[1]});
        getdocument({code:code.split("--")[1]});
    }
    render() {
        const {
            tree=[],
            Doc=[],
            keycode,
        } = this.props;
        return (
            <div>
                <DynamicTitle title="表单管理" {...this.props}/>
                <Sidebar>
                    <WorkTree treeData={tree}
                                selectedKeys={keycode}
                                onSelect={this.onSelect.bind(this)}
                                {...this.state}  />
                </Sidebar>
                <Content>
                    <TableInfo {...this.props} array = {this.array} {...this.state}/>
                    <FormAddition {...this.props} array = {this.array} {...this.state}/>
                </Content>
            </div>
        )
    }
}