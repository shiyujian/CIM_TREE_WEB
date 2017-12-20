import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button, Row, Col, Select, Upload, Input, message, Icon} from 'antd';

import VedioTable from './VedioTable';
import './index.less';
const Option = Select.Option;
import { SERVICE_API} from '_platform/api';

export default class UploadFooter extends Component{
    constructor(props){
        super(props);
        this.state={
            checkUsers:[]
        }
    }

    componentDidMount(){
        const {getAllUsers} = this.props;
        getAllUsers().then(data => {
            const checkUsers = data.map(record => {
                return (
                    <Option key={record.id} value={JSON.stringify(record)}>{record.account.person_name}</Option>
                )
            })
            this.setState({checkUsers})
        })
    }

    render(){
        const {checkUsers} = this.state;

        return(<div>
            <Row className="rowSpacing">
                <Col span={24}>
                    <Button type="primary" onClick={modalDownload}>模板下载</Button>
                    <Upload className="spacing" {...this.uploadProps}>
                        <Button>
                            <Icon type="upload"/>上传附件
                        </Button>
                    </Upload>
                    {/* <Input style={{width: 300}} className="inlineBlock" disabled value="F:\XA\项目基础信息导入表.xlxs"/>
                    <Button className="spacing">上传并预览</Button> */}
                    <div className="inlineBlock">审核人: </div>
                    <Select className="select" defaultValue={"请选择"} >
                        {checkUsers}
                    </Select>
                    <Button type="primary" className="spacing">提交</Button>
                </Col>
            </Row>
            <Row className="rowSpacing">
                <Col>
                    注:&emsp;1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；<br />
                    &emsp;&emsp; 2、数值用半角阿拉伯数字，如：1.2<br />
                    &emsp;&emsp; 3、日期必须带年月日，如2017年1月1日<br />
                    &emsp;&emsp; 4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.<br />
                </Col>
            </Row>
        </div>)
    }

    uploadProps = {
        action: `${SERVICE_API}/excel/upload-api/`,
        accept: acceptFile.join(","),
        showUploadList: false,
        beforeUpload: (info)=>{
            if(acceptFile.indexOf(info.type) >-1){
                return true
            }else{
                message.error("只能上传Excel类型的文件!");
                return false
            }
        },
        onChange: (info)=>{
            if (info.file.status === 'done') {
                const {excelTitle, dataIndex, storeExcelData} = this.props,
                    {response: excelData, name} = info.file,
                    key = Object.keys(excelData);

                if(key.length != 1){
                    message.error("Excel只允许有一个sheet");
                    return
                }
                const data = excelData[key[0]];
                if(data[0].length != [...( new Set( [...data[0],...excelTitle] ) )].length ){
                    message.error("请使用下载的模板");
                    return
                }
        
                let dataSource = data.map((result,index) =>{
                    let a = {
                        index: index,
                        wbsCode: name.replace(/\.\w+$/,'')
                    };
                    dataIndex.forEach((record,index) => {
                        a[record] = result[index]
                    })
                    return a
                })
                dataSource.shift();

                storeExcelData(dataSource);
                message.success(`${name} 上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        }
    }

}

UploadFooter.PropTypes ={
    excelTitle: PropTypes.array.isRequired,
    dataIndex: PropTypes.array.isRequired,
    getAllUsers: PropTypes.func.isRequired
}

const modalDownload = ()=>{
    const downloadLink = '';
    //window.open(downloadLink);
}

const acceptFile = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']