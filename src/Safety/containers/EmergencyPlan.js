import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions } from '../store/emergencyPlan';
import { actions as platformActions } from '_platform/store/global';
import { actions as treeActions } from '../store/commonTree';
import { actions as fileActions } from '../store/staticFile';
import {
    Table, Button, Icon, Modal, Input, message,
    notification, DatePicker, Select, Form, Upload, Card, Popconfirm
} from 'antd';
import WorkPackageTree from '../components/WorkPackageTree';
import AddPlan from '../components/EmergencyPlan/AddPlan'; 
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
        const { safety: { emergencyPlan = {} } = {}, platform } = state;
        return {...emergencyPlan, platform }
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions, ...previewActions, ...treeActions,...fileActions}, dispatch)
    })
)

export default class EmergencyPlan extends Component {

    static propTypes = {};

    constructor(props) {
        super(props);
        this.state = {
            index: '-1',
            setVisible: false,
            record:{},
            dataSource: [],
            newKey: Math.random(),
            code: '',
            rst: {},
            projectName: '',
            videoVisible:false
        }
    }
    componentDidMount() {

    }

    addClick = () => {
        //debugger
        this.setState({
            setVisible: true,
            newKey: Math.random()
        });
    }

    deletet(record, index){
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
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let datas = this.state.dataSource;
                values.uploadTime = moment().format('YYYY-MM-DD HH:mm:ss');
                values.docCode = "safetytestfile"+moment().format("YYYYMMDDHHmmss");
                debugger
                //values.attachment = this.props.attachment;
                let projectData = {
                    "code": "safetytestfile" + moment().format("YYYYMMDDHHmmss"),
                    "name": "YJYA",
                    "obj_type": "C_DOC",
                    "workpackages": [{
                        "pk": rst.pk,
                        "code": rst.code,
                        "obj_type": rst.obj_type
                    }],
                    "profess_folder": { "code": "folder_code", "obj_type": "C_DIR" },
                    "extra_params": {
                        "createTime": moment().format("YYYY-MM-DD HH:mm:ss"),
                        "emergencyPlanName" : values.emergencyPlanName,
                    },
                    "basic_params": {
                        "files": [
                            {
                                "a_file": values.attachment[0].response.a_file,
                                "name": values.attachment[0].name,
                                "download_url": values.attachment[0].response.download_url,
                                "misc": "file",
                                "mime_type": values.attachment[0].response.mime_type
                            },
                        ]
                    },
                    "status": "A",
                    "version": "A"
                }
                let valuesTemp = {
                    "a_file": values.attachment[0].response.a_file,
                    "name": values.attachment[0].name,
                    "download_url": values.attachment[0].response.download_url,
                    "misc": "file",
                    "mime_type": values.attachment[0].response.mime_type,
                }
                values.docCode = projectData.code;
                values.attachment = valuesTemp;
                datas.push(values);
                postDocument({},projectData);
                this.setState({
                    setVisible: false,
                    dataSource: datas,
                });
            } else {
                return
            }
        });
    }
    
    goCancel(){
        this.setState({
            setVisible:false,
            setEditVisible: false,
            videoVisible:false,
        });
    }

    previewFiles(record,index){
        let data = this.state.dataSource;
        if(data[index].attachment.mime_type.indexOf("video")!==-1){  //video
            this.setState({record,videoVisible:true});
        }else{
            const {actions: {openPreview}} = this.props;
            let filed = {};
            filed.misc = data[index].attachment.misc;
            filed.a_file = `${SOURCE_API}` + (data[index].attachment.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            filed.download_url = `${STATIC_DOWNLOAD_API}` + (data[index].attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            filed.name = data[index].attachment.name;
            filed.mime_type = data[index].attachment.mime_type;
            openPreview(filed);
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
    
    download(record,index){
        let data = this.state.dataSource;
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
            hasDoc,
            projectData;
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
                    if (rst.related_documents[i].name == "YJYA") {
                        getDocument({ code: rst.related_documents[i].code }).then((doc) => {
                            values.attachment = doc.basic_params.files[0];
                            values.uploadTime = doc.extra_params.createTime;
                            values.emergencyPlanName = doc.extra_params.emergencyPlanName;
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
        const { dataSource,record } = this.state;
        debugger
        const urlvideo = record.attachment ? record.attachment.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '') : '';
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            // width: '5%',
            render: (text, record, index) => {
                return <div>{index + 1}</div>
            }
        }, {
            title: '应急预案名称',
            dataIndex: 'emergencyPlanName',
            key: 'emergencyPlanName',
            width: '44%'
        }, {
            title: '工程名称',
            dataIndex: 'projectName',
            key: 'projectName',
            width: '25%'
        }, {
            title: '上传时间',
            dataIndex: 'uploadTime',
            key: 'uploadTime',
            width: '11%'
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
            )
        }];

        return (
            <div className='titleRegister'>
                <DynamicTitle title="应急预案" {...this.props} />
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
                            title={() => '应急预案'}
                        />
                    </Card>
                    <Modal
                        key={this.state.newKey}
                        width="50%"
                        maskClosable={false}
                        title={"添加应急预案"}
                        visible={this.state.setVisible}
                        onOk={() => this.setAddData()}
                        onCancel={this.goCancel.bind(this)}
                    >
                        <AddPlan props={this.props} state={this.state} />
                    </Modal>
                    <Modal
                        title={"视频预览"}
                        width="60%"
                        height="80%"
                        visible={this.state.videoVisible}
                        maskClosable={false}
                        footer={null}
                        onCancel={this.goCancel.bind(this)}
                    >
                        <video 
                         style={{width: '100%', height: '100%'}} 
                         src={`${SOURCE_API}${urlvideo}`} 
                         controls="controls">您的浏览器不支持浏览
                        </video>
                    </Modal>
                </Content>
                <Preview />
            </div>

        );
    }
}
EmergencyPlan = Form.create({})(EmergencyPlan);

