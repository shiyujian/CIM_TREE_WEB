import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/attendanceGroup';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import {
    AttendanceGroupTable,
    AsideTree
} from '../components/AttendanceGroup';
import './index.less';
@connect(
    state => {
        const { checkwork: { attendanceGroup = {} }, platform } = state;
        return { ...attendanceGroup, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class AttendanceGroup extends Component {
    constructor (props) {
        super(props);
        this.state = {
            allorgtree:[],
        };
    }

    componentDidMount () {
        this.getAllOrgTree();
    }

    getAllOrgTree(){
        const { actions: {getAllOrgTree} } = this.props;
        getAllOrgTree().then((data) => {
            let treedata = [];
            for(let i=0;i<data.children.length;i++){
                //目前只获取建设单位，九号地块和十万亩苗景兼用林组织机构
                if(data.children[i].name == '建设单位'||data.children[i].name == '九号地块'||data.children[i].name == '十万亩苗景兼用林'){
                    treedata.push(data.children[i]);
                }
            }
            debugger
            this.setState({
                allorgtree:treedata
            })
        })
    }


    render () {
        return (       
            <div className='taskTeam-Layout'>
                <AsideTree {...this.props} {...this.state} className='aside-Layout'/>
                <div className='table-Layout'>
                    <AttendanceGroupTable {...this.props} {...this.state} />
                </div>
            </div>
               
        );
    }
}
