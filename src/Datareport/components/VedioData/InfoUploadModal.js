import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, Row, Col, message} from 'antd';

import VedioInfoTable from './VedioInfoTable';
import UploadFooter from './UploadFooter'
import {launchProcess, addSerialNumber} from './commonFunc';

export default class InfoUploadModal extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource:[]
        }
    }

    componentWillReceiveProps(){    //初始化table的数据
        this.state.dataSource = [];
    }

    render(){
        const {dataSource} = this.state;
        const {uploadModal, closeModal, actions} = this.props;

        return(
            <Modal
             width={1280}
             title={"影像信息上传"}
             visible={uploadModal}
             onCancel={()=>closeModal("uploadModal")}
             footer={null}
            >
                <VedioInfoTable
                 fileDel={true}
                 dataSource={dataSource}
                 storeExcelData={this.storeExcelData}
                 actions={this.props.actions}
                />
                <UploadFooter
                 dataSource={dataSource}
                 storeExcelData= {this.storeExcelData}
                 excelTitle= {excelTitle}
                 dataIndex= {dataIndex}
                 actions= {actions}
                 onOk= {this.onOk}
                />
            </Modal>
        )
    }

    storeExcelData = (data)=>{
        const dataSource = addSerialNumber(data);
        this.setState({dataSource});
    }
 
    onOk = async (selectUser)=>{  //发起流程，关闭Modal
        const {dataSource} = this.state;

        let hasFile = true;
        dataSource.forEach(record =>{
            if(!(record.file&&record.file.id)){
                hasFile = false;
            }
        })
        if(!hasFile){
            message.error("请上传影像");
            return;
        }

        const {closeModal, actions:{ createWorkflow, logWorkflowEvent }} = this.props,
            name = '影像信息批量录入';
        await launchProcess({dataSource,selectUser,name},{createWorkflow,logWorkflowEvent});
        message.success("上传数据成功");
        closeModal("uploadModal");
    }
}

InfoUploadModal.PropTypes ={
    uploadModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
}

const dataIndex = ["projectName","ShootingDate"], 
    excelTitle = ["项目/子项目名称","拍摄时间"];