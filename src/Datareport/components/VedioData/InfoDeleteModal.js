import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, message, notification} from 'antd';

import VedioInfoTable from './VedioInfoTable';
import ChangeFooter from './ChangeFooter';
import {launchProcess} from './commonFunc';

export default class InfoDeleteUpload extends Component{

    constructor(props){
        super(props);
        this.state={
            dataSource: []
        }
        Object.assign(this,{
            selectUser: null,
            description: null,
        })
    }

    componentDidMount(){
        const {dataSource} = this.props,
            sourceData = JSON.parse(JSON.stringify(dataSource));

        this.setState({dataSource:sourceData})
    }
    
    render(){
        const {deleteModal, closeModal} = this.props,
            {dataSource} = this.state;

        return(
            <Modal
             width={1280}
             visible={deleteModal}
             onCancel={()=>closeModal("deleteModal")}
             onOk={this.onOk}
            >
                <h1 style={{ textAlign: "center"}}>申请删除</h1>
                <VedioInfoTable
                 dataSource={dataSource}
                 storeExcelData={this.storeExcelData}
                 fileDel={true}
                 allowDel={false}
                />
                <ChangeFooter
                 storeState={this.storeState}
                />
            </Modal>
        )
    }

    onOk = async ()=>{
        const {selectUser,description} = this;
        if(!selectUser){
            notification.warning({
                message: '请选择审核人！',
                duration: 2
            });
            return
        }

        const {dataSource, closeModal, actions:{ createWorkflow, logWorkflowEvent }} = this.props,
            name = '影像信息数据删除';
        await launchProcess({dataSource,selectUser,name,description},{createWorkflow,logWorkflowEvent});
        notification.success({
            message: '申请删除流程成功！',
            duration: 2
        });
        closeModal("deleteModal");
    }

    storeExcelData = (dataSource)=>{
        this.setState({dataSource});
    }
    storeState = (data={})=>{
        Object.assign(this,data);
    }
}

InfoDeleteUpload.PropTypes ={
    changeModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
}