import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, message} from 'antd';

import VedioTable from './VedioTable';
import ChangeFooter from './ChangeFooter';
import {launchProcess} from './commonFunc';

export default class DeleteUpload extends Component{

    render(){
        const {deleteModal, closeModal, dataSource} = this.props;

        return(
            <Modal
             width={1280}
             title={"视频监控删除"}
             visible={deleteModal}
             onCancel={()=>closeModal("deleteModal")}
             footer={null}
            >
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
        message.success("上传数据成功");
        closeModal("deleteModal");
    }

}

DeleteUpload.PropTypes ={
    changeModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
}