import React, { Component } from 'react';
import { Table, Tabs, Button, Row, Col, message, Modal, 
    Popconfirm, Card, Select, Form,notification } from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import AddModal from './AddModal';
import EditModal from './EditModal';
import { STATIC_DOWNLOAD_API,SOURCE_API } from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';
import * as previewActions from '../../../_platform/store/global/preview';

const Option = Select.Option;

class Responsibility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: '-1',
            newKey: Math.random(),
            newKey1: Math.random()*5,
            setVisible: false,
            setEditVisible: false,
            dataSource: [],
            record:{},
        }
    }

    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps");
        if(nextProps.dataSource){
            this.setState({dataSource:nextProps.dataSource});
        }
    }

    onViewClick(record,index){
        const {actions: {openPreview}} = this.props;
        let filed = {};
        filed.misc = record.attachment.misc;
        filed.a_file = `${SOURCE_API}`+ (record.attachment.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}`+ (record.attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = record.attachment.name;
        filed.mime_type = record.attachment.mime_type;
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
        let apiGet = `${STATIC_DOWNLOAD_API}` + (record.attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        this.createLink(this,apiGet);
    }

    addClick = () => {
        this.setState({
            setVisible: true,
            newKey: Math.random(),
        });
    }

    editClick = (record, index) => {
        this.setState({
            setEditVisible: true,
            newKey1: Math.random()*5,
            record: record,
        });
    }

    setEditData(){
        const {
            actions: {
                patchResponsibility,
                getResponsibility
            },
            project,
            unitProject,
            construct
        } = this.props;
        let datas = [];
        const {record} = this.state;
        this.props.form.validateFields((err,values) => {
            if(!err){
                let projectData = {
                    responsor:{
                        name:values.responsible,
                        duty:values.duties
                    },
                    duty:values.responsibilities,
                    response_docs: [
                        {
                          "a_file": values.attachment[0].a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                          "name": values.attachment[0].name,
                          "download_url": values.attachment[0].download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                          "misc": "file",
                          "mime_type": values.attachment[0].mime_type
                        }
                    ]
                }
                patchResponsibility({pk:record.id},projectData).then(rst=>{
                    if(rst.id){
                        notification.info({
                            message: '修改成功！',
                            duration: 2
                        });
                        getResponsibility({},{project_unit_pk:unitProject.pk}).then(rst=>{
                            rst.map(item=>{
                                let data = {};
                                data.responsible = item.responsor.name;
                                data.duties = item.responsor.duty;
                                data.responsibilities = item.duty;
                                data.attachment = item.response_docs[0];
                                data.id = item.id;
                                datas.push(data);
                            });
                            this.setState({setEditVisible:false,dataSource:datas});
                        });
                    }else{
                        notification.error({
                            message: '添加失败！',
                            duration: 2
                        });
                    }
                });
                this.setState({
                    setEditVisible:false
                });
            }
        }); 
    }

    deletet(record,index){
        const {
            actions: {
                deleteResponsibility,
            }
        } = this.props;
        let datas = this.state.dataSource;
        deleteResponsibility({pk:record.id}).then(rst=>{
            if(rst===""){
                notification.error({
                    message: '删除成功！',
                    duration: 2
                });
                datas.splice(index,1);
                this.setState({dataSource:datas});
            }else{
                notification.error({
                    message: '删除失败！',
                    duration: 2
                });
            }
        });
        
    }

    onOk(){
        this.setState({
            setVisible:false,
        });
    }
    setAddData(){
        const {
            actions: {
                addResponsibility,
                getResponsibility
            },
            project,
            unitProject,
            construct
        } = this.props;
        let datas = [];
        this.props.form.validateFields((err,values) => {
            if(!err){
                let projectData = {
                    project:{
                        pk:project.pk,
                        code:project.code,
                        name:project.name,
                        obj_type:project.obj_type
                    },
                     constructionorg: {
                        obj_type: construct.obj_type,
                        code: construct.code,
                        name: construct.name
                    },
                    project_unit:{
                        pk:unitProject.pk,
                        code:unitProject.code,
                        name:unitProject.name,
                        obj_type:unitProject.obj_type
                    },
                    responsor:{
                        name:values.responsible,
                        duty:values.duties
                    },
                    duty:values.responsibilities,
                    response_docs: [
                        {
                          "a_file": values.attachment[0].a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                          "name": values.attachment[0].name,
                          "download_url": values.attachment[0].download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                          "misc": "file",
                          "mime_type": values.attachment[0].mime_type
                        }
                    ]
                }
                addResponsibility({},projectData).then(rst=>{
                    if(rst.id){
                        notification.info({
                            message: '添加成功！',
                            duration: 2
                        });
                        getResponsibility({},{project_unit_pk:unitProject.pk}).then(rst=>{
                            rst.map(item=>{
                                let data = {};
                                data.responsible = item.responsor.name;
                                data.duties = item.responsor.duty;
                                data.responsibilities = item.duty;
                                data.attachment = item.response_docs[0];
                                data.id = item.id;
                                datas.push(data);
                            });
                            this.setState({setVisible:false,dataSource:datas});
                        });
                    }else{
                        notification.error({
                            message: '添加失败！',
                            duration: 2
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
        });
    }

    render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        console.log("this props render",this.props)
        //安全目标表格
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            //width: '5%',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        }, {
            title: '责任人',
            dataIndex: 'responsible',
            key:'responsible',
            //width: '12%',
        },{
            title: '职务',
            dataIndex: 'duties',
            key:'duties',
            //width: '12%',
        },{
            title: '职责',
            dataIndex: 'responsibilities',
            key:'responsibilities',
        },{
            title: '责任书',
            dataIndex: 'responsibilityLetter',
            key:'responsibilityLetter',
            //width: '10%',
            render: (text,record,index) => (
                <span>
                    <a onClick={this.onViewClick.bind(this,record,index)}>预览</a>
                    <span className="ant-divider" />
                    <a onClick={this.onDownClick.bind(this,record,index)}>下载</a>
                </span>
            ),
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
           // width: '10%',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.editClick.bind(this, record,index)}>编辑</a>
                    <span className="ant-divider" />
                    <Popconfirm
                        placement="rightTop"
                        title="确定删除吗？"
                        onConfirm={this.deletet.bind(this, record, index)}
                        okText="确认"
                        cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                </span>
            ),
        }]

        return (
            <div>
                <Card>
                    <Row>
                        <Button type='primary' style={{ float: 'right' }}
                            onClick={this.addClick.bind(this)}>
                            新增
                        </Button>
                    </Row>
                    <Table style={{ marginTop: '10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered />
                </Card>
                <Modal
                    title="新增安全责任制"
                    width={760}
                    maskClosable={false}
                    key={this.state.newKey}
                    visible={this.state.setVisible}
                    onOk={this.setAddData.bind(this)}
                    onCancel={this.goCancel.bind(this)}
                >
                    <AddModal props={this.props} state={this.state} />
                </Modal>
                <Modal
                    title="编辑安全责任制"
                    width={760}
                    key={this.state.newKey1}
                    maskClosable={false}
                    visible={this.state.setEditVisible}
                    onOk={this.setEditData.bind(this)}
                    onCancel={this.goCancel.bind(this)}
                >
                    <EditModal props={this.props} state={this.state} />
                </Modal>
                <Preview/>
            </div>
        )
    }
}

export default Form.create()(Responsibility);