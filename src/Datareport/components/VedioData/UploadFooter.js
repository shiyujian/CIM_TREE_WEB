import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button, Row, Col, Select, Upload, Input, message, Icon, Cascader, notification} from 'antd';

import VedioTable from './VedioTable';
import './index.less';
const Option = Select.Option;
import { SERVICE_API,NODE_FILE_EXCHANGE_API} from '_platform/api';
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
                    <Button onClick={this.modalDownload}  className="spacing" >模板下载</Button>
                    <Upload className="spacing" {...this.uploadProps}>
                        <Button>
                            <Icon type="upload"/>上传并预览
                        </Button>
                    </Upload>
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
                notification.error({
                    message: '只能上传Excel类型的文件！',
                    duration: 2
                });
                return false
            }
        },
        onChange: (info)=>{
            if (info.file.status === 'done') {
                const {excelTitle, dataIndex, storeExcelData} = this.props,
                    {response: excelData, name} = info.file,
                    key = Object.keys(excelData);

                if(key.length != 1){
                    notification.error({
                        message: 'Excel只允许有一个sheet！',
                        duration: 2
                    });
                    return
                }
                const data = excelData[key[0]];
                if(data[0].length != [...( new Set( [...data[0],...excelTitle] ) )].length ){
                    notification.error({
                        message: '请使用下载的模板！',
                        duration: 2
                    });
                    return
                }
        
                let sourceData = data.map((result,index) =>{
                    let a = {};
                    dataIndex.forEach((record,index) => {
                        a[record] = result[index]
                    })
                    return a
                })
                sourceData.shift();
                
                storeExcelData(sourceData);
                Object.assign(this,{
                    excelUpload: true
                })
                notification.success({
                    message: `${name}上传成功！`,
                    duration: 2
                });
            } else if (info.file.status === 'error') {
                notification.error({
                    message: `${info.file.name} 上传失败!`,
                    duration: 2
                });
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
            notification.error({
                message: '请上传附件！',
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
        if(!project){
            notification.error({
                message: '请选择项目-单位工程！',
                duration: 2
            });
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

    onChange = async (value)=>{
        if(value.length===2){
            const {storeExcelData,dataSource,actions:{getTreeRootNode}} = this.props,
                project = {
                    projectName: JSON.parse(value[0]).name,
                    enginner: JSON.parse(value[1]).name,
                    value: value
                },
                projectCode = JSON.parse(value[1]).code;
            let wbs = [];

            const sourceData = dataSource.map(data=>{
                wbs.push(data.wbsCode);
                return Object.assign({},data,project)
            })
            wbs = Array.from(new Set(wbs));

            const all = wbs.map(rst=>getTreeRootNode({code:rst}) ),
                check = await Promise.all(all);
            let returnProjectCode = check.map(rst=>rst.children[0].children[0].code);
            returnProjectCode = Array.from(new Set(returnProjectCode));

            if(returnProjectCode.length>1){
                notification.error({
                    message: 'wbs编码不属于同一个单位工程！',
                    duration: 2
                });
            }else if(returnProjectCode[0] != projectCode){
                notification.error({
                    message: 'wbs编码不属于本单位工程！',
                    duration: 2
                });
            }else{
                storeExcelData(sourceData)
                this.project = true;
            }      
        }
    }
    modalDownload = ()=>{
        // const downloadLink = '';
        const {modalDown} = this.props;
        
        this.createLink(this,modalDown);
        //window.open(downloadLink);
    }
     createLink = (name, url) => {    //下载未应用
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

}

UploadFooter.PropTypes ={
    excelTitle: PropTypes.array.isRequired,
    dataIndex: PropTypes.array.isRequired,
    getAllUsers: PropTypes.func.isRequired
}
 


const projectReturn = (data={})=>{
    const {name,code,obj_type} = data;
    return {name,code,obj_type}
}

const acceptFile = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']