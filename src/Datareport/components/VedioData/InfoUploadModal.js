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
        const {actions:{getAllUsers},
            uploadModal, closeModal
        } = this.props;

        return(
            <Modal
             width={1280}
             title={"影像信息上传"}
             visible={uploadModal}
             onCancel={closeModal}
             footer={null}
            >
                <VedioInfoTable
                 dataSource={dataSource}
                 storeExcelData={this.storeExcelData}
                />
                <UploadFooter
                 storeExcelData= {this.storeExcelData}
                 excelTitle= {excelTitle}
                 dataIndex= {dataIndex}
                 getAllUsers= {getAllUsers}
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
             name = '影像信息信息批量录入';
 
         await launchProcess({dataSource,selectUser,name},{createWorkflow,logWorkflowEvent});
         message.success("上传数据成功");
         closeModal();
     }
}

InfoUploadModal.PropTypes ={
    uploadModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
}

const dataIndex = ["projectName","ShootingDate"], 
    excelTitle = ["项目/子项目名称","拍摄时间"];