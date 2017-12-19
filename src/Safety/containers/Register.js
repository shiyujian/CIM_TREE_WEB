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
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Table, Button, Row, Col, Icon, Modal, Input, message, Popconfirm,
    notification, DatePicker, Select, InputNumber, Form, Upload, Card,Carousel} from 'antd';
import { AddRegister, EditRegister}from '../components/Register';
import WorkPackageTree from '../components/WorkPackageTree';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import { SOURCE_API, STATIC_DOWNLOAD_API} from '_platform/api';
import './Register.css';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Option = Select.Option;

@connect(
    state => {
        const {safety: {staticFile = {},register = {}}, platform} = state;
        return {staticFile, platform,register}
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions, ...previewActions,...RegisterActions}, dispatch)
    })
)

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newKey: Math.random(),
            newKey1: Math.random()*5,
            newKey2:Math.random()*3,
            setVisible: false,
            setEditVisible: false,
            preViewPics:false,
            record: {},
            index: '-1',
            dataSource: [],
            project:{},
            unitProject:{},
            construct:{},
            typeArray:[],
            levelArray:[],
            currentPics:[]
        };
    }

    getLevelValue = (level) =>{
        const {levelArray} = this.state;
        if(typeof(level)!=="string"){
            return level;
        }else{
            for(let i=0;i<levelArray.length;i++){
                if(levelArray[i].name===level){
                    return levelArray[i].id;
                }
            }
        }
    }

    getTypeValue = (type) =>{
        const {typeArray} = this.state;
        if(typeof(type)!=="string"){
            return type;
        }else{
            for(let i=0;i<typeArray.length;i++){
                if(typeArray[i].name===type){
                    return typeArray[i].id;
                }
            }
        }
    }
    componentDidMount() {
        const { 
            actions: { 
                getAccidentLevel,
                getAccidentType
            } 
        } = this.props;
        getAccidentType().then(rst =>{
            if(rst.length===0){
                notification.info({
                    message: '获取事故类型失败',
                    duration: 2
                });
            }else{
                this.setState({typeArray:rst});
            }
        });
        getAccidentLevel().then(rst =>{
            if(rst.length===0){
                notification.info({
                    message: '获取事故等级失败',
                    duration: 2
                });
            }else{
                this.setState({levelArray:rst});
            }
        });
    }

    onViewClick(record,index){
        const { actions: { openPreview } } = this.props;
        let data = this.state.dataSource;
        let filed = {};
        filed.misc = data[index].attachment.misc;
        filed.a_file = `${SOURCE_API}` + (data[index].attachment.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (data[index].attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = data[index].attachment.name;
        filed.mime_type = data[index].attachment.mime_type;
        openPreview(filed);
    }

    onViewClick1(record,index){
        let currentPics = [];
        for(let i=0;i<record.images.length;i++){
            currentPics.push(record.images[i].a_file);
        }
        //显示图片预览走马灯的modal
        this.setState({
            newKey2: Math.random()*2,
            preViewPic: true,
            currentPics: currentPics
        });
    }

    onDownClick1(record,index){
        if(record.images.length===0){
            notification.info({
                message: '没有可下载图片！',
                duration: 2
            });
        }else{
            for(let i=0;i<record.images.length;i++){
                let apiGet = `${STATIC_DOWNLOAD_API}` + (record.images[i].download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
                this.createLink(this,apiGet);
            }
        }
        
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
        let apiGet = `${STATIC_DOWNLOAD_API}` + (record.attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        this.createLink(this,apiGet);
    }

    addClick = () => {
        this.setState({
            newKey: Math.random()*2,
            setVisible: true,
        });
    }

    editClick = (record, index) => {
        this.setState({
            setEditVisible: true,
            newKey1: Math.random()*5,
            record: record,
            index: index
        });
    }

    setEditData(){
        let jsxThis = this;
        const {project,unitProject,construct} = this.state;
        const { 
            actions: { 
                putAccident,
                getAccident
            } 
        } = this.props;
        let postProject = {
            pk:project.pk,
            code:project.code,
            name:project.name,
            obj_type:project.obj_type
        };
        let postUnit = {
            pk:unitProject.pk,
            code:unitProject.code,
            name:unitProject.name,
            obj_type:unitProject.obj_type
        };
        let postData = {};
        postData.project = postProject;
        postData.project_unit = postUnit;
        postData.constructionorg = construct;
        this.props.form.validateFields((err,values) => {
            if(!err){
                postData.manager = {
                    name:values.projectManager,
                }
                postData.snapshots1 = values.riskContent;
                postData.level = this.getLevelValue(values.level);
                postData.accident_type = this.getTypeValue(values.type);
                debugger
                postData.slight_wound = values.minorInjury;
                postData.serious_wound = values.heavyInjury;
                postData.death = values.death;
                postData.financial_loss1 = values.economicLoss;
                postData.occur_time = moment(values.time._d).format('YYYY-MM-DD')+" 00:00:00";
                if(values.livePhotos){
                    let postPhotos = [];
                    for(let i=0;i<values.livePhotos.length;i++){
                        let postPhoto = {
                            a_file:(values.livePhotos[i].a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                            name:values.livePhotos[i].name,
                            download_url:(values.livePhotos[i].a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                            misc:"file",
                            mime_type:values.livePhotos[i].mime_type
                        };
                        postPhotos.push(postPhoto);
                    }
                    postData.images = postPhotos;
                }
                postData.snapshots2 = {
                    a_file:(values.attachment[0].a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                    name:values.attachment[0].name,
                    download_url:(values.attachment[0].a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                    misc:"file",
                    mime_type:values.attachment[0].mime_type
                }
                putAccident({pk:this.state.record.id},postData).then(rst =>{
                    if(rst.id){
                        notification.info({
                            message: '修改成功！',
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
                                    data.minorInjury = rst[i].slight_wound;
                                    data.heavyInjury = rst[i].serious_wound;
                                    data.death = rst[i].death;
                                    data.economicLoss = rst[i].financial_loss1;
                                    data.images = rst[i].images;
                                    data.attachment = rst[i].snapshots2;
                                    dataSource.push(data);
                                }
                                this.setState({dataSource});
                            }
                        });
                    }
                });
                this.setState({
                    setEditVisible:false
                });
            }
        }); 
    }

    delete(index){
        let datas = this.state.dataSource;
        const { 
            actions: { 
                deleteAccident
            } 
        } = this.props;
        deleteAccident({pk:datas[index].id}).then(rst=>{
            if(!rst.detail){
                datas.splice(index,1);
                this.setState({dataSource:datas});
                notification.info({
                    message: '删除成功！',
                    duration: 2
                });
            }else{
                notification.info({
                    message: '删除失败！',
                    duration: 2
                });
            }
        });
    }

    setAddData(){
        let jsxThis = this;
        const {project,unitProject,construct} = this.state;
        const { 
            actions: { 
                postAccident,
                getAccident
            } 
        } = this.props;
        let postProject = {
            pk:project.pk,
            code:project.code,
            name:project.name,
            obj_type:project.obj_type
        };
        let postUnit = {
            pk:unitProject.pk,
            code:unitProject.code,
            name:unitProject.name,
            obj_type:unitProject.obj_type
        };
        let postData = {};
        postData.project = postProject;
        postData.project_unit = postUnit;
        postData.constructionorg = construct;
        this.props.form.validateFields((err,values) => {
            if(!err){
                postData.manager = {
                    name:values.projectManager,
                }
                postData.snapshots1 = values.riskContent;
                postData.level = values.level;
                postData.accident_type = values.type;
                postData.slight_wound = values.minorInjury;
                postData.serious_wound = values.heavyInjury;
                postData.death = values.death;
                postData.financial_loss1 = values.economicLoss;
                postData.occur_time = moment(values.time._d).format('YYYY-MM-DD')+" 00:00:00";
                if(values.livePhotos){
                    let postPhotos = [];
                    for(let i=0;i<values.livePhotos.length;i++){
                        let postPhoto = {
                            a_file:(values.livePhotos[i].a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                            name:values.livePhotos[i].name,
                            download_url:(values.livePhotos[i].a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                            misc:"file",
                            mime_type:values.livePhotos[i].mime_type,
                        };
                        postPhotos.push(postPhoto);
                    }
                    postData.images = postPhotos;
                }
                postData.snapshots2 = {
                    a_file:(values.attachment[0].a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                    name:values.attachment[0].name,
                    download_url:(values.attachment[0].a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                    misc:"file",
                    mime_type:values.attachment[0].mime_type,
                }
                postAccident({},postData).then(rst =>{
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
                                    data.minorInjury = rst[i].slight_wound;
                                    data.heavyInjury = rst[i].serious_wound;
                                    data.death = rst[i].death;
                                    data.economicLoss = rst[i].financial_loss1;
                                    data.images = rst[i].images;
                                    data.attachment = rst[i].snapshots2;
                                    dataSource.push(data);
                                }
                                this.setState({dataSource});
                            }
                        });
                    }
                });
                this.setState({
                    setVisible:false
                });
            }
        }); 
    }
    
	goCancel(){
		this.setState({
            setVisible:false,
            setEditVisible: false,
            preViewPic:false
		});
    }

    onSelect = (project,unitProject)=>{
        const { 
            actions: { 
                getAccident,
                getWorkpackagesByCode,
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
                    data.minorInjury = rst[i].slight_wound;
                    data.heavyInjury = rst[i].serious_wound;
                    data.death = rst[i].death;
                    data.economicLoss = rst[i].financial_loss1;
                    data.images = rst[i].images;
                    data.attachment = rst[i].snapshots2;
                    dataSource.push(data);
                }
                this.setState({dataSource});
            }else{
                this.setState({dataSource:[]});
            }
        });
    };


    render() {
        console.log('register props',this.props);
        const {
            form: {getFieldDecorator}
        } = this.props;
        
        const {dataSource,currentPics} = this.state;
        
        const columns = [{
            title: '编号',
            dataIndex: 'index',
            key:'index',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        },{
            title: '事故名称',
            dataIndex: 'riskContent',
            key:'riskContent'
        },{
            title: '事故时间',
            dataIndex: 'time',
            key:'time'
        },{
            title: '工程部位',
            dataIndex: 'position',
            key:'position'
        },{
            title: '事故等级',
            dataIndex: 'level',
            key:'level'
        },{
            title: '伤亡情况',
            dataIndex: 'situation',
            key:'situation',
            children:[{
                title: '轻伤人数',
                dataIndex:'minorInjury',
                key:'minorInjury',
            },{
                title: '重伤人数',
                dataIndex:'heavyInjury',
                key:'heavyInjury',
            },{
                title: '死亡人数',
                dataIndex:'death',
                key:'death',
            }]
        },{
            title: '估算直接经济损失(万元)',
            dataIndex: 'economicLoss',
            key:'economicLoss',
        },{
            title: '事故快报',
            dataIndex: 'accidentExpress',
            key:'accidentExpress',
            render: (text,record,index) => (
                <span>
                    <a onClick={this.onViewClick.bind(this,record,index)}>预览</a>
                    <span className="ant-divider" />
                    <a onClick={this.onDownClick.bind(this,record,index)}>下载</a>
                </span>
            )
        },{
            title: '现场照片',
            dataIndex: 'livePhotos',
            key:'livePhotos',
            render: (text,record,index) => (
                <span>
                    <a onClick={this.onViewClick1.bind(this,record,index)}>预览</a>
                    <span className="ant-divider" />
                    <a onClick={this.onDownClick1.bind(this,record,index)}>下载</a>
                </span>
            )
        },{
            title: '操作',
            dataIndex: 'operating',
            key:'operating',
            width:'10%',
            render: (text,record,index) => (
                <span>
                    <a onClick={this.editClick.bind(this,record,index)}>更新</a>
                    <span className="ant-divider" />
                    <Popconfirm
                        placement="rightTop"
                        title="确定删除吗？"
                        onConfirm={this.delete.bind(this, index)}
                        okText="确认"
                        cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                </span>
            )
        }];

        return (
            <div>
                <DynamicTitle title="事故登记" {...this.props}/>
                <Sidebar>
                    <div style={{overflow:'hidden'}} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
                    </div>
                </Sidebar>
                <Content>
                        <Row style={{ marginBottom: '20px' }}>
                            <Button 
                                key='create'
                                type="primary" 
                                onClick={this.addClick.bind(this)}
                                style={{ marginRight: '25px',width: '110px' }} 
                                size="large" icon="plus-circle-o"
                            >新增</Button>
                        </Row>
                    <div className='titleRegister'>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            bordered
                            title={()=>"安全事故登记"}/>
                    </div>
                    <Modal
                        title="新增安全事故登记"
                        width={760}
                        maskClosable={false}
                        key={this.state.newKey}
                        visible={this.state.setVisible}
                        onOk={this.setAddData.bind(this)}
                        onCancel={this.goCancel.bind(this)}
                    >
                        <AddRegister props={this.props} state={this.state}/>
                    </Modal>
                    <Modal
                        title="编辑安全事故"
                        width={760}
                        key={this.state.newKey1}
                        maskClosable={false}
                        visible={this.state.setEditVisible}
                        onOk={this.setEditData.bind(this)}
                        onCancel={this.goCancel.bind(this)}
                    >
                        <EditRegister props={this.props} state={this.state} />
                    </Modal>
                    <Modal
                        title="事故图片预览"
                        width={760}
                        key={this.state.newKey2}
                        maskClosable={false}
                        visible={this.state.preViewPic}
                        onOk={this.goCancel.bind(this)}
                        onCancel={this.goCancel.bind(this)}
                    >
                        {
                            currentPics.length !== 0 ?  
                                <div style={{marginBottom:'10px'}}>
                                    <Carousel autoplay>
                                        {
                                            currentPics.map(x => (
                                                <div className="picDiv">
                                                    <img className="picImg" src={`${STATIC_DOWNLOAD_API}${x}`} alt=""/>
                                                </div>
                                            ))
                                        }
                                    </Carousel>
                                </div>
                            
                            :<p>暂无图片可以预览</p>
                        }
                    </Modal>
                </Content>
                <Preview/>
            </div>
            
        );
    }
}
export default Form.create()(Register);

