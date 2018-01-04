import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, message, notification} from 'antd';

import VedioTable from './VedioTable';
import ChangeFooter from './ChangeFooter';
import {launchProcess} from './commonFunc';

export default class DeleteUpload extends Component{

    render(){
        const {deleteModal, closeModal, dataSource} = this.props;

        return(
            <Modal
             width={1280}
             visible={deleteModal}
             onCancel={()=>closeModal("deleteModal")}
             footer={null}
            >
                <h1 style={{ textAlign: "center"}}>申请删除</h1>
                <VedioTable
                 dataSource={dataSource}
                />
                <ChangeFooter
                 onOk={this.onOk}
                />
            </Modal>
        )
    }

    onOk = async (selectUser,description)=>{
        const {dataSource, closeModal, actions:{ createWorkflow, logWorkflowEvent }} = this.props,
            name = '视频监控数据删除';

        await launchProcess({dataSource,selectUser,name,description},{createWorkflow,logWorkflowEvent});
        notification.success({
            message: '发起删除流程成功！',
            duration: 2
        });
        closeModal("deleteModal");
    }

}

DeleteUpload.PropTypes ={
    changeModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
}