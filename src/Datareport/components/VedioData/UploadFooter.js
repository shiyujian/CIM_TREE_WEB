import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button, Row, Col, Select, Upload, Input, message, Icon, Cascader} from 'antd';

import VedioTable from './VedioTable';
import './index.less';
const Option = Select.Option;
import { SERVICE_API} from '_platform/api';
import {getAllUsers} from './commonFunc';

export default class UploadFooter extends Component{
    constructor(props){
        super(props);
        this.state={
            checkUsers: [],
            options: []
        }
        Object.assign(this,{    //不需要从新render的数据
            excelUpload: false,
            selectUser: null,
            project: false
        })
    }

    async componentDidMount(){
        const {actions:{getProjectTree}} = this.props;
        const checkUsers = await getAllUsers(); //获取所有的用户
        this.setState({checkUsers});

        getProjectTree({depth:1}).then(rst =>{
            if(rst.status){
                const options = rst.children.map(item=>{
                    return {
                        value:JSON.stringify(item),
                        label:item.name,
                        isLeaf:false
                    }
                })
                this.setState({options});
            }
        });
    }

    render(){
        const {checkUsers,options} = this.state;

        return(<div>
            <Row className="rowSpacing">
                <Col span={24}>
                    <Button onClick={modalDownload} type="primary" className="spacing" >模板下载</Button>
                    <Upload className="spacing" {...this.uploadProps}>
                        <Button>
                            <Icon type="upload"/>上传附件
                        </Button>
                    </Upload>
                    {/* <Input style={{width: 300}} className="inlineBlock" disabled value="F:\XA\项目基础信息导入表.xlxs"/>
                    <Button className="spacing">上传并预览</Button> */}
                    <div className="inlineBlock">审核人: </div>
                    <Select onSelect={this.selectCheckUser} className="select" defaultValue={"请选择"} >
                        {checkUsers}
                    </Select>
                    <div className="inlineBlock">项目-单位工程：</div>
                    <Cascader
                        options={options}
                        //className='btn'
                        loadData={this.loadData}
                        onChange={this.onChange}
                        placeholder={"请选择项目-单位工程"}
                        changeOnSelect
                    />
                    <Button onClick={this.onSubmit} type="primary" className="spacing" >提交</Button>               
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
                    let a = {};
                    dataIndex.forEach((record,index) => {
                        a[record] = result[index]
                    })
                    return a
                })
                dataSource.shift();
                
                storeExcelData(dataSource);
                Object.assign(this,{
                    excelUpload: true
                })
                message.success(`${name} 上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        }
    }

    selectCheckUser = (value)=>{
        this.selectUser = JSON.parse(value);
    }

    onSubmit = ()=>{
        const {excelUpload, selectUser,project} = this,
            {onOk} = this.props;
        if(!excelUpload){
            message.error("请上传附件！");
            return
        }
        if(!selectUser){
            message.error("请选择审核人！");
            return
        }
        if(!project){
            message.error("请选择项目-单位工程！");
            return
        }
        
        onOk(selectUser);
    }

    loadData = (selectedOptions)=>{
        const {actions:{getProjectTree}} = this.props,
            targetOption = selectedOptions[selectedOptions.length - 1]; //其实只有一个
        targetOption.loading = true;
        getProjectTree({depth:2}).then(rst =>{
            if(rst.status){
                let units = [];
                rst.children.forEach(item=>{
                    if(item.code === JSON.parse(targetOption.value).code){  //当前选中项目?
                        units = item.children.map(unit =>{
                            const {name,code,obj_type} = unit;
                            return {
                                value: JSON.stringify({name,code,obj_type}),
                                label: name
                            }
                        })
                    }
                })
                Object.assign(targetOption,{
                    loading: false,
                    children: units
                })
                this.setState({options:[...this.state.options]})    //不知道为啥，官方文档这么写的
            }
        });
    }

    onChange = (value)=>{
        if(value.length===2){
            const {storeExcelData,dataSource} = this.props,
                project = {
                    projectName: JSON.parse(value[0]).name,
                    enginner: JSON.parse(value[1]).name,
                    value: value
                };
            const sourceData = dataSource.map(data=>{
                return Object.assign({},data,project)
            })
            storeExcelData(sourceData)
            this.project = true;
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

const projectReturn = (data={})=>{
    const {name,code,obj_type} = data;
    return {name,code,obj_type}
}

const acceptFile = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']