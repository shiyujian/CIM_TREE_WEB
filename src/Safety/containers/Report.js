/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 * 
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../store/staticFile';
import {actions as RegisterActions} from '../store/register';
import {actions as platformActions} from '_platform/store/global';
import { actions as fileActions } from '../store/staticFile';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Table, Button, Row, Col, Icon, Modal, Input, message, Popconfirm,
    notification, DatePicker, Select, InputNumber, Form, Upload, Card} from 'antd';
import './Register.css';
import {EditReport}from '../components/Report';
import WorkPackageTree from '../components/WorkPackageTree';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import {SOURCE_API, STATIC_DOWNLOAD_API} from '_platform/api';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

 @connect(
    state => {
        const {safety: {staticFile = {},register = {}}, platform} = state;
        return {staticFile, platform,register}
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions, ...previewActions,...RegisterActions}, dispatch)
    })
)
 

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newKey: Math.random(),
            setVisible: false,
            index:'-1',
            dataSource:[],
            record: {},
            project:{},
            unitProject:{},
            construct:{}
        };
    }
    componentDidMount() {}
   
    onViewClick(record,index){
        const { actions: { openPreview } } = this.props;
        let filed = {};
        filed.misc = record.wound_persons.misc;
        filed.a_file = `${SOURCE_API}` + (record.wound_persons.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (record.wound_persons.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = record.wound_persons.name;
        filed.mime_type = record.wound_persons.mime_type;
        openPreview(filed);
    }

    onViewClick1(record,index){
        const { actions: { openPreview } } = this.props;
        let filed = {};
        filed.misc = record.report.misc;
        filed.a_file = `${SOURCE_API}` + (record.report.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (record.report.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = record.report.name;
        filed.mime_type = record.report.mime_type;
        openPreview(filed);
    }

    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    onDownClick(record,index){
        let apiGet = `${STATIC_DOWNLOAD_API}` + (record.wound_persons.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        this.createLink(this,apiGet);
    }

    onDownClick1(record,index){
        let apiGet = `${STATIC_DOWNLOAD_API}` + (record.report.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        this.createLink(this,apiGet);
    }

    editClick = (record,index) => {
        this.setState({
            newKey: Math.random()*2,
            setVisible: true,
            index,
            record
        });
    }

    setEditData(){
        let jsxThis = this;
        const {project,unitProject,record} = this.state;
        const { 
            actions: { 
                patchAccidentReport,
                getAccident
            } 
        } = this.props;
        this.props.form.validateFields((err,values) => {
            if(!err){
                debugger
                let postData = {};
                if(values.attachment.length!==0){
                    let array = [];
                    let postFile = {
                        a_file:(values.attachment[0].a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                        name:values.attachment[0].name,
                        download_url:(values.attachment[0].a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                        misc:"file",
                        mime_type:values.attachment[0].mime_type,
                    };
                    array.push(postFile);
                    postData.wound_persons = array;
                }
                if(values.attachment1.length!==0){
                    let array = [];
                    let postFile = {
                        a_file:(values.attachment1[0].a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                        name:values.attachment1[0].name,
                        download_url:(values.attachment1[0].a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                        misc:"file",
                        mime_type:values.attachment1[0].mime_type
                    };
                    array.push(postFile);
                    postData.report = array;
                }
                if(postData.report || postData.wound_persons){  //if the postObj is not null
                    patchAccidentReport({pk:record.id},postData).then(rst =>{
                        if(rst.id){
                            notification.info({
                                message: '添加成功！',
                                duration: 2
                            });
                            getAccident({projectCode:project.code,unitCode:unitProject.code}).then(rst =>{
                                let dataSource = [];
                                if(rst.length!==0){
                                    for(let i=0;i<rst.length;i++){
                                        let data = {};
                                        data.projectName = rst[i].project.name + "--" + rst[i].project_unit.name;
                                        data.constructionUnit = rst[i].constructionorg.name;
                                        data.projectManager = rst[i].manager.name;
                                        data.id = rst[i].id;
                                        data.riskContent = rst[i].snapshots1;
                                        data.time = rst[i].created_on.slice(0,10);
                                        data.position = rst[i].position?rst[i].position:"无";
                                        data.level = rst[i].level.name;
                                        data.type = rst[i].accident_type.name;
                                        if(rst[i].wound_persons!==null && rst[i].wound_persons.length!==0){
                                            data.wound_persons = rst[i].wound_persons[0];
                                        }
                                        if(rst[i].report!==null && rst[i].report.length!==0){
                                            data.report = rst[i].report[0];
                                        }
                                        dataSource.push(data);
                                    }
                                    this.setState({dataSource});
                                }else{
                                    this.setState({dataSource:[]});
                                }
                            });
                        }else{
                            notification.info({
                                message: '上传失败！',
                                duration: 2
                            });
                        }
                    });
                }else{
                    notification.info({
                        message: '您未上传文件！',
                        duration: 2
                    });
                }
                this.setState({
                    setVisible:false
                });
            }
        }); 
    }
    
	goCancel(){
		this.setState({
            setVisible:false
		});
    }

    onSelect = (project,unitProject)=>{
        const { 
            actions: { 
                getAccident,
                getWorkpackagesByCode
            } 
        } = this.props;
        if(unitProject){
            this.setState({project,unitProject});
            getWorkpackagesByCode({code:unitProject.code}).then(rst =>{
                if(rst.code){
                    if(rst.extra_params && rst.extra_params.unit){
                        for(let i=0;i<rst.extra_params.unit.length;i++){
                            if(rst.extra_params.unit[i].type==="施工单位/C"){
                                this.setState({construct:rst.extra_params.unit[i]});
                            }
                        }
                    }
                }
            });
        }else{
            return;
        }
        getAccident({projectCode:project.code,unitCode:unitProject.code}).then(rst =>{
            let dataSource = [];
            if(rst.length!==0){
                for(let i=0;i<rst.length;i++){
                    let data = {};
                    data.projectName = rst[i].project.name + "--" + rst[i].project_unit.name;
                    data.constructionUnit = rst[i].constructionorg.name;
                    data.projectManager = rst[i].manager.name;
                    data.id = rst[i].id;
                    data.riskContent = rst[i].snapshots1;
                    data.time = rst[i].created_on.slice(0,10);
                    data.position = rst[i].position?rst[i].position:"无";
                    data.level = rst[i].level.name;
                    data.type = rst[i].accident_type.name;
                    if(rst[i].wound_persons!==null && rst[i].wound_persons.length!==0){
                        data.wound_persons = rst[i].wound_persons[0];
                    }
                    if(rst[i].report!==null && rst[i].report.length!==0){
                        data.report = rst[i].report[0];
                    }
                    dataSource.push(data);
                }
                this.setState({dataSource});
            }else{
                this.setState({dataSource:[]});
            }
        });
    };

    render() {
        const { dataSource } = this.state;
        const {
            form: {getFieldDecorator}
        } = this.props;
        const columns = [{
            title: '编号',
            dataIndex: 'index',
            width:'5%',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        },{
            title: '事故名称',
            dataIndex: 'riskContent',
            key:'riskContent',
            width:'20%'
        },{
            title: '事故时间',
            dataIndex: 'time',
            key:'time',
            width:'15%'
        },{
            title: '事故部位',
            dataIndex: 'position',
            key:'position',
            width:'10%'
        },{
            title: '事故等级',
            dataIndex: 'level',
            key:'level',
            width:'10%'
        },{
            title: '伤亡人员名单',
            dataIndex: 'accidentNameList',
            key:'accidentNameList',
            width:'15%',
            render: (text,record,index) => {
                if(record.wound_persons){
                   return <div>
                        <a onClick={this.onViewClick.bind(this,record,index)}>预览</a>
                        <span className="ant-divider" />
                        <a onClick={this.onDownClick.bind(this,record,index)}>下载</a>
                    </div>
                }else{
                    return <p>未上传</p>
                }
            }
        },{
            title: '事故报告',
            dataIndex: 'accReport',
            key:'accReport',
            width:'15%',
            render: (text,record,index) => {
                if(record.report){
                 return   <div>
                        <a onClick={this.onViewClick1.bind(this,record,index)}>预览</a>
                        <span className="ant-divider" />
                        <a onClick={this.onDownClick1.bind(this,record,index)}>下载</a>
                    </div>
                }else{
                    return <p>未上传</p>
                }
            }
        },{
            title: '操作',
            dataIndex: 'operating',
            key:'operating',
            width:'10%',
            render: (text,record,index) => (
                <span>
                    <a onClick={this.editClick.bind(this,record,index)}>编辑</a>
                </span>
            )
        }];
        
        return (
            <div>
                <DynamicTitle title="事故报告" {...this.props} />
                <Sidebar>
                    <div style={{overflow:'hidden'}} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
                    </div>
                </Sidebar>
                <Content>
                    <div className='titleRegister'>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            bordered
                            title={() => "安全事故报告"} />
                    </div>
                    <Modal
                    title="编辑文件"
                    width={560}
                    maskClosable={false}
                    key={this.state.newKey}
                    visible={this.state.setVisible}
                    onOk={this.setEditData.bind(this)}
                    onCancel={this.goCancel.bind(this)}
                >
                    <EditReport props={this.props} state={this.state}/>
                </Modal>
                </Content>
                <Preview />
            </div>
        );
    }
}
export default Form.create()(Report);