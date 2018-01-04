import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, Row, Col, message, notification} from 'antd';

import VedioTable from './VedioTable';
import UploadFooter from './UploadFooter';
import {launchProcess, addSerialNumber} from './commonFunc';

export default class VedioUpload extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource:[],
        }
    }

    render(){
        const {dataSource} = this.state;
        const {actions, uploadModal, closeModal,modalDown} = this.props;
        return(
            <Modal
             width={1280}
             visible={uploadModal}
             onCancel={()=>closeModal("uploadModal")}
             footer={null}
            >
                <h1 style={{ textAlign: "center"}}>发起填报</h1>
                <VedioTable
                 dataSource={dataSource}
                 storeExcelData={this.storeExcelData}
                 fileDel={true}
                />
                <UploadFooter
                modalDown = {modalDown}
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
        const {dataSource} = this.state,
            {closeModal, actions:{ createWorkflow, logWorkflowEvent }} = this.props,
            name = '视频监控批量录入';

        await launchProcess({dataSource,selectUser,name},{createWorkflow,logWorkflowEvent});
        notification.success({
            message: '上传数据成功！',
            duration: 2
        });
        closeModal("uploadModal");
    }
}

VedioUpload.PropTypes ={
    uploadModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
}

const dataIndex = ["cameraId","cameraName","ip","port","username","password","xAxes","yAxes","modal","uptime","wbsCode"], 
    excelTitle = ["摄像头编码","摄像头名称","IP","端口","用户名","密码","X坐标","Y坐标","型号","摄像头上线时间","wbs编码"];