import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, Row, Col, message, notification} from 'antd';

import VedioInfoTable from './VedioInfoTable';
import UploadFooter from './UploadFooter'
import {launchProcess, addSerialNumber} from './commonFunc';
import {DataReportTemplate_ImageInformation} from '_platform/api.js';

export default class InfoUploadModal extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource:[],
        }
        Object.assign(this,{
            selectUser: null,
            project: false,
        })
    }

    componentWillReceiveProps(){    //初始化table的数据
        this.state.dataSource = [];
    }

    render(){
        const {dataSource} = this.state;
        const {uploadModal, closeModal, actions,modalDown} = this.props;

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
                <VedioInfoTable
                 fileDel={true}
                 dataSource={dataSource}
                 storeExcelData={this.storeExcelData}
                 actions={this.props.actions}
                 enginner={false}
                />
                <UploadFooter
                 modalDown = {DataReportTemplate_ImageInformation}
                 dataSource={dataSource}
                 storeExcelData= {this.storeExcelData}
                 excelTitle= {excelTitle}
                 dataIndex= {dataIndex}
                 actions= {actions}
                 storeState={this.storeState}
                 check={false}
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

        let hasFile = true;
        dataSource.forEach(record =>{
            if(!(record.file&&record.file.id)){
                hasFile = false;
            }
        })
        if(!hasFile){
            notification.error({
                message: '请上传影像！',
                duration: 2
            });
            return;
        }

        const {closeModal, actions:{ createWorkflow, logWorkflowEvent }} = this.props,
            name = '影像信息批量录入';
        await launchProcess({dataSource,selectUser,name},{createWorkflow,logWorkflowEvent});
        notification.success({
            message: '上传数据成功！',
            duration: 2
        });
        closeModal("uploadModal");
    }
}

InfoUploadModal.PropTypes ={
    uploadModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
}

const dataIndex = ["projectName","ShootingDate"], 
    excelTitle = ["项目/子项目名称","拍摄时间"];