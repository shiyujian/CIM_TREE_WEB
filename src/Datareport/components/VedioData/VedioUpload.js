import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Row, Col, message} from 'antd';

import VedioTable from './VedioTable';
import UploadFooter from './UploadFooter'
import './index.less';

export default class VedioUpload extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource:[]
        }
    }

    render(){
        const {dataSource} = this.state;
        return(<div>
            <Row type='flex' justify='center' >
                <p className="titleFont">结果预览</p>
            </Row>
            <VedioTable
             dataSource={dataSource}
            />
            <UploadFooter
             storeExcelData = {this.storeExcelData}
             excelTitle = {excelTitle}
             dataIndex = {dataIndex}
            />
        </div>)
    }

    storeExcelData = (dataSource)=>{
       this.setState({dataSource});
    }
}

VedioUpload.PropTypes ={
    //showChange:PropTypes.func.isRequired
}

const dataIndex = ["cameraId","projectName","enginner","cameraName","ip","port","username","password","xAxes","yAxes","modal","uptime"], 
    excelTitle = ["摄像头编码","项目/子项目名称","单位工程","摄像头名称","IP","端口","用户名","密码","X坐标","Y坐标","型号","摄像头上线时间"];