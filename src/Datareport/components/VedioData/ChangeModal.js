import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Modal, message} from 'antd';

import VedioTable from './VedioTable';
import ChangeFooter from './ChangeFooter';
import {launchProcess} from './commonFunc';

export default class VedioUpload extends Component{
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
        const {changeModal, closeModal} = this.props,
            {dataSource} = this.state;

        return(
            <Modal
             width={1280}
             title={"视频监控修改"}
             visible={changeModal}
             onCancel={()=>closeModal("changeModal")}
             footer={null}
            >
                <VedioTable
                 dataSource={dataSource}
                 storeData={this.storeData}
                 edit={true}
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
            name = '视频监控数据修改';

        await launchProcess({dataSource,selectUser,name,description},{createWorkflow,logWorkflowEvent});
        message.success("发起修改数据流程成功");
        closeModal("changeModal");
    }

    storeData = (dataSource)=>{
        this.setState({dataSource});
    }
}

VedioUpload.PropTypes ={
    changeModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
}

const dataIndex = ["cameraId","cameraName","ip","port","username","password","xAxes","yAxes","modal","uptime","wbsCode"], 
    excelTitle = ["摄像头编码","摄像头名称","IP","端口","用户名","密码","X坐标","Y坐标","型号","摄像头上线时间","wbs编码"];