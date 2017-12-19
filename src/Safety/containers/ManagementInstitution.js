import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions } from '../store/managementInstitution';
import { actions as platformActions } from '_platform/store/global';
import { actions as treeActions } from '../store/commonTree';
import { actions as fileActions } from '../store/staticFile';
import {
    Table, Button, Row, Col, Icon, Modal, Input, message, Popconfirm,
    notification, DatePicker, Select, InputNumber, Form, Upload, Card
} from 'antd';
import WorkPackageTree from '../components/WorkPackageTree';
import AddInstitution from '../components/ManagementInstitution/AddInstitution'; 
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import { SOURCE_API, STATIC_DOWNLOAD_API } from '_platform/api';
import './Register.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const FormItem = Form.Item

@connect(
    state => {
        const { safety: { managementInstitution = {} } = {}, platform } = state;
        return { ...managementInstitution, platform }
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions, ...previewActions, ...treeActions,...fileActions }, dispatch)
    })
)

export default class ManagementInstitution extends Component {
    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            index: '-1',
            setVisible: false,
            record:{},
            newKey: Math.random(),
            dataSource: [],
            code: '',
            rst: {},
            projectName: ''
            //projectManager: '',
        }
    }
    componentDidMount() {

    }

    addClick = () => {
        //debugger
        this.setState({
            setVisible: true,
            newKey: Math.random(),
        });
    }

    deletet(record, index) {
        let datas = this.state.dataSource;
        const { code, rst, projectName } = this.state;
        const {
            actions: {
            getProjects,
            setProjects,
            getWorkpackages,
            postDocument,
            getDocument,
            setDocument,
            delDocument
            }
        } = this.props;
        debugger
        //let c = datas[index].docCode;
        delDocument({ code: datas[index].docCode })
        datas.splice(index, 1);
        this.setState({ dataSource: datas });
    }

    setAddData(){
        const { code, rst, projectName} = this.state;
        const {
            actions: {
                getProjects,
                setProjects,
                getWorkpackages,
                postDocument,
                getDocument,
                setDocument,
                delDocument
            }
        } = this.props;
        let datas = this.state.dataSource,
            ds;
        debugger
        this.props.form.validateFields((err, values) => {//涉及组件通信， 校验子组件的信息require valid。
             if (!err) {
                let len = values.attachment.length;
                for (let i=0; i<len; i++) {
                    ds = {};
                    ds.uploadTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    ds.attachment = values.attachment[i];
                    ds.projectName = values.projectName;
                    let projectData = {
                        "code": "safetytestfile" + moment().format("YYYYMMDDHHmmss") + i,
                        "name": "AQGLZD",
                        "obj_type": "C_DOC",
                        "workpackages": [{
                            "pk": rst.pk,
                            "code": rst.code,
                            "obj_type": rst.obj_type
                        }],
                        "profess_folder": { "code": "folder_code", "obj_type": "C_DIR" },
                        "extra_params": {
                            "createTime": moment().format("YYYY-MM-DD HH:mm:ss"),
                        },
                        "basic_params": {
                            "files": [
                                {
                                    "a_file": values.attachment[i].a_file,
                                    "name": values.attachment[i].name,
                                    "download_url": values.attachment[i].download_url,
                                    "misc": "file",
                                    "mime_type": values.attachment[i].mime_type
                                },
                            ]
                        },
                        "status": "A",
                        "version": "A"
                    }
                    console.log(projectData);
                    ds.docCode = projectData.code;
                    ds.institutionName = values.attachment[i].name.split('.')[0];
                    datas.push(ds);
                    //创建document
                    postDocument({}, projectData);
                }
                this.setState({
                    setVisible: false,
                    dataSource: datas
                });
            }
        });
    }
    
	goCancel(){
		this.setState({
            setVisible:false,
            setEditVisible: false
		});
	}

    previewFiles(record,index){
        const {actions: {openPreview}} = this.props;//？？？通过props接受子组件传回来的数据？？？
        let data = this.state.dataSource;
        let filed = {};
        /*if (data[index].attachment.size) {
            filed.misc = data[index].attachment.misc;
            filed.a_file = `${SOURCE_API}` + data[index].attachment.a_file;
            filed.download_url = `${STATIC_DOWNLOAD_API}` + data[index].attachment.download_url;
            filed.name = data[index].attachment.name;
            filed.id = data[index].attachment.id;
            filed.mime_type = data[index].attachment.mime_type;
            openPreview(filed);
        } else {
            openPreview(data[index].attachment);
        }*/
        debugger
        filed.misc = data[index].attachment.misc;
        filed.a_file = `${SOURCE_API}` + (data[index].attachment.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (data[index].attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = data[index].attachment.name;
        filed.mime_type = data[index].attachment.mime_type;
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
    
    download(record,index){
        let data = this.state.dataSource;
        debugger
        /*let apiGet;
        if (data[index].attachment.size) {
            apiGet = `${STATIC_DOWNLOAD_API}` + data[index].attachment.download_url;
        } else {
            apiGet = data[index].attachment.download_url;
        }
        this.createLink(this, apiGet);*/
        let apiGet = `${STATIC_DOWNLOAD_API}` + (data[index].attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        this.createLink(this,apiGet);
    }

    onSelect(selectedKeys, e) {
        const {
            actions: {
                getProjects,
                setProjects,
                getWorkpackages,
                postDocument,
                getDocument,
                setDocument,
                delDocument
            }
        } = this.props;
        debugger
        this.setState({
            code: selectedKeys[0],
            projectName: e.node.props.dataRef.title,
            //projectManager: '潘森',
        })
        if (!e.selected) {
            return
        }

        let datas = [],
            hasDoc;
        getWorkpackages({ code: selectedKeys[0] }).then((rst) => {
            console.log('rst', rst);
            this.setState({
                rst: rst
            })
            if (rst == "object not found") {//单位工程施工包无信息
                this.setState({
                    dataSource: []
                });
                return
            }
            debugger
            if (rst.related_documents) {
                hasDoc = rst.related_documents.length != 0;
            } else {
                this.setState({
                    dataSource: []
                });
                return
            }
            if (hasDoc) {
                let len = rst.related_documents.length//JSON.parse(rst.extra_params.safetyPlan).length;
                for (let i = 0; i < len; i++) {
                    let values = {};
                    values.projectName = e.node.props.dataRef.title;
                    //values.projectManager = "潘森";
                    if (rst.related_documents[i].name == "AQGLZD") {
                        getDocument({ code: rst.related_documents[i].code }).then((doc) => {
                            values.attachment = doc.basic_params.files[0];
                            values.uploadTime = doc.extra_params.createTime;
                            values.institutionName = doc.basic_params.files[0].name.split('.')[0];
                            values.docCode = rst.related_documents[i].code;
                            datas.push(values);
                            this.setState({
                                dataSource: datas
                            });
                        })
                    } else {
                        this.setState({
                            dataSource: []
                        });
                    }
                }
            } else {
                this.setState({
                    dataSource: []
                });
            }
        })
    }

    render() {
        const { dataSource } = this.state;
        const { 
            form: {getFieldDecorator}, //和子组件关联 
        } = this.props;
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: '10%',
            render: (text, record, index) => {
                return <div>{index + 1}</div>
            }
        }, {
            title: '制度名称',
            dataIndex: 'institutionName',
            key: 'institutionName',
            width: '20%'
        }, {
            title: '上传时间',
            dataIndex: 'uploadTime',
            key: 'uploadTime',
            width: '15%'
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '15%',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.previewFiles.bind(this, record, index)}>预览</a>
                    <span className="ant-divider" />
                    <a onClick={this.download.bind(this, record, index)}>下载</a>
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
        }];
        return (
            <div className='titleRegister'>
                <DynamicTitle title="安全管理制度" {...this.props} />
                <Sidebar>
                    <WorkPackageTree {...this.props} 
                    onSelect={this.onSelect.bind(this)}/>
                </Sidebar>
                <Content>
                    <Card>
                        <Button
                            key='create'
                            type="primary"
                            onClick={() => this.addClick()}
                            style={{ width: '110px', marginBottom: '20px' }}
                            size="large" icon="plus-circle-o"
                        >添加</Button>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            bordered
                            title={() => '安全管理制度'}
                        />
                    </Card>
                    <Modal
                        key={this.state.newKey}
                        width="50%"
                        maskClosable={false}
                        title={"添加安全管理制度"}
                        visible={this.state.AddModalVisible}
                        visible={this.state.setVisible}
                        onOk={() => this.setAddData()}  //对子组件 内的数据进行 检验 和Modal 不操作本身
                        onCancel={this.goCancel.bind(this)}
                    >
                        <AddInstitution props={this.props} state={this.state} />
                    </Modal>
                </Content>
                <Preview />
            </div>
        );
    }
}
ManagementInstitution = Form.create({})(ManagementInstitution);// 父组件继承 form   子组件 引用 form 数据可以进行交流
//form相当于一个对讲机，，父子组件通过form进行交流
