import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, message} from 'antd';

import VedioInfoTable from './VedioInfoTable';
import ChangeFooter from './ChangeFooter';
import {launchProcess} from './commonFunc';

export default class InfoDeleteUpload extends Component{

    render(){
        const {deleteModal, closeModal, dataSource} = this.props;

        return(
            <Modal
             width={1280}
             title={"影像信息删除"}
             visible={deleteModal}
             onCancel={()=>closeModal("deleteModal")}
             footer={null}
            >
                <VedioInfoTable
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
            name = '影像信息数据删除';

        await launchProcess({dataSource,selectUser,name,description},{createWorkflow,logWorkflowEvent});
        message.success("发起删除流程成功");
        closeModal("deleteModal");
    }

}

InfoDeleteUpload.PropTypes ={
    changeModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
}