import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, message} from 'antd';

import VedioInfoTable from './VedioInfoTable';
import ChangeFooter from './ChangeFooter';
import {launchProcess} from './commonFunc';

export default class InfoChangeModal extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource: []
        }
    }

    componentDidMount(){
        const {dataSource} = this.props,
            sourceData = JSON.parse(JSON.stringify(dataSource));

        this.setState({dataSource:sourceData})
    }

    render(){
        const {changeModal, closeModal, actions} = this.props,
            {dataSource} = this.state;

        return(
            <Modal
             width={1280}
             title={"影像信息修改"}
             visible={changeModal}
             onCancel={()=>closeModal("changeModal")}
             footer={null}
            >
                <VedioInfoTable
                 dataSource={dataSource}
                 storeExcelData={this.storeExcelData}
                 fileDel={true}
                 edit={true}
                 actions={actions}
                />
                <ChangeFooter
                 onOk={this.onOk}
                />
            </Modal>
        )
    }

    onOk = async (selectUser,description)=>{    //dataSource需要修改
        const { closeModal, actions:{ createWorkflow, logWorkflowEvent }} = this.props,
            {dataSource} = this.state,
            name = '影像信息数据修改';

        await launchProcess({dataSource,selectUser,name,description},{createWorkflow,logWorkflowEvent});
        message.success("发起修改数据流程成功");
        closeModal("changeModal");
    }

    storeExcelData = (dataSource)=>{
        this.setState({dataSource});
    }
}

InfoChangeModal.PropTypes ={
    changeModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
}