import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, Row, Col, message, notification} from 'antd';

import VedioTable from './VedioTable';
import UploadFooter from './UploadFooter';
import {launchProcess, addSerialNumber} from './commonFunc';
import {DataReportTemplate_VideoMonitor} from '_platform/api.js';

export default class VedioUpload extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource: [],
        }
        Object.assign(this,{
            selectUser: null,
            project: false,
        })
    }

    render(){
        const {dataSource} = this.state;
        const {actions, uploadModal, closeModal} = this.props;
        return(
            <Modal
             width={1280}
             visible={uploadModal}
             onCancel={()=>closeModal("uploadModal")}
             onOk={this.onOk}
            >
                <Row type='flex' justify='center' >
                    <h1>发起填报</h1>
                </Row>
                <VedioTable
                 dataSource={dataSource}
                 storeExcelData={this.storeExcelData}
                 fileDel={true}
                 enginner={false}
                />
                <UploadFooter
                 modalDown = {DataReportTemplate_VideoMonitor}
                 dataSource={dataSource}
                 storeExcelData= {this.storeExcelData}
                 excelTitle= {excelTitle}
                 dataIndex= {dataIndex}
                 actions= {actions}
                 storeState={this.storeState}
                />
            </Modal>
        )
    }

    storeExcelData = (data)=>{
        const dataSource = addSerialNumber(data);
        this.setState({dataSource});
    }
    storeState = (data={})=>{
        Object.assign(this,data);
    }

    onOk = async ()=>{  //发起流程，关闭Modal

        const {dataSource} = this.state,
            {selectUser,project} = this;
        if(dataSource.length == 0){
            notification.error({
                message: '请上传附件！',
                duration: 2
            });
            return
        }
        if(!project){
            notification.error({
                message: '请选择项目-单位工程！',
                duration: 2
            });
            return
        }
        if(!selectUser){
            notification.error({
                message: '请选择审核人！',
                duration: 2
            });
            return
        }

        const {closeModal, actions:{ createWorkflow, logWorkflowEvent }} = this.props,
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