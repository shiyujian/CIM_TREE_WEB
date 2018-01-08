import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, message, notification} from 'antd';

import VedioTable from './VedioTable';
import ChangeFooter from './ChangeFooter';
import {launchProcess} from './commonFunc';

export default class ChangeModal extends Component{
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
        const {changeModal, closeModal} = this.props,
            {dataSource} = this.state;

        return(
            <Modal
             width={1280}
             visible={changeModal}
             onCancel={()=>closeModal("changeModal")}
             onOk={this.onOk}
            >
                <h1 style={{ textAlign: "center"}}>申请变更</h1>
                <VedioTable
                 dataSource={dataSource}
                 storeExcelData={this.storeData}
                 edit={true}
                 fileDel={true}
                />
                <ChangeFooter
                 storeState={this.storeState}
                />
            </Modal>
        )
    }

    onOk = async ()=>{    //dataSource需要修改
        const {selectUser,description} = this;
        if(!selectUser){
            notification.warning({
                message: '请选择审核人！',
                duration: 2
            });
            return
        }

        const { closeModal, actions:{ createWorkflow, logWorkflowEvent }} = this.props,
            {dataSource} = this.state,
            name = '视频监控数据修改';
        await launchProcess({dataSource,selectUser,name,description},{createWorkflow,logWorkflowEvent});
        notification.success({
            message: '发起修改数据流程成功！',
            duration: 2
        });
        closeModal("changeModal");
    }

    storeData = (dataSource)=>{
        this.setState({dataSource});
    }
    storeState = (data={})=>{
        Object.assign(this,data);
    }
}

ChangeModal.PropTypes ={
    changeModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
}