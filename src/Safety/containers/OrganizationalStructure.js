import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { actions } from '../store/organizationalStructure';
import { actions as fileActions } from '../store/staticFile';
import { actions as treeActions } from '../store/commonTree';
import { Button, Row, Col, Icon, Table, Input, message,notification, Select, Upload, Card, Popconfirm, Modal, Form,} from 'antd';
// import { ProjectTree} from '../components/Scheme';
import WorkPackageTree from '../components/WorkPackageTree';
import AddModal from '../components/OrganizationalStructure/AddModal';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import { FILE_API, CUS_TILEMAP, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

@connect(
    state => {
        const { safety: { organizationalStructure = {} } = {}, platform } = state;
        return { ...organizationalStructure, platform }
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions, ...previewActions, ...fileActions, ...treeActions }, dispatch)
    })
)

class OrganizationalStructure extends Component {
    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            setVisible: false,
            setEditVisible: false,
            hasDoc: false,
            record:{},
            code:'',
            rst:{},
            projectName:'',
            projectManager:'',
            mine_type:'',
            src1:'',
            pk:'',
            selectedKeys:[],
            e:{},
            project:{},
            construct:{},
            fileObj:{},
            companyName:'',
        }
    }
    componentDidMount() {
        this.initTree();
    }
    initTree =()=>{
        const { actions: {
            getProjectTree,
            getProjects, 
            setProjects, 
            getWorkpackages, 
            postDocument,
            getDocument,
            setDocument,
            delDocument
        } } = this.props;
        let{hasDoc,code,e}=this.state;
        getProjectTree() .then(res=> {
            this.setState({
                code:res.children[0].children[0].code,
                projectName:res.children[0].children[0].name,
                e:res.children[0].children[0]
            });
            getWorkpackages({code:res.children[0].children[0].code}).then((rst) => {
                console.log('rst',rst);
                this.setState({
                    rst:rst
                });
                if(rst === "object not found"){//单位工程施工包无信息
                    alert('单位工程施工包无信息');
                    return
                };
                if(rst.related_documents){
                    hasDoc= rst.related_documents.length !== 0;
                }
                if(hasDoc){
                    let len = rst.related_documents.length;
                    for(let i = 0;i<len;i++){
                        let values = {};
                        if(rst.related_documents[i].name == "ZZJG"){
                            getDocument({code:rst.related_documents[i].code}).then((doc) => {
                                values.attachment = doc.basic_params.files[0];
                                this.setState({
                                    src1:doc.basic_params.files[0].a_file,
                                    pk:doc.pk,
                                    code1:rst.related_documents[i].code
                                });
                            })
                            hasDoc=false;
                            break;
                        }
                    }    
                }
                if(hasDoc!==false){
                    this.setState({src1:''});
                    notification.warning({
                        message: '当前节点未上传文档！',
                    });
                }
            })
        })
    }
    editClick = (record, index) => {
        this.setState({
            setEditVisible: true,
            newKey1: Math.random() * 5,
            record: record,
            index: index
        });
    }

    setEditData() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                debugger
                let datas = this.state.dataSource;
                //values.date = moment(values.date._d).format('YYYY-MM-DD');
                datas.splice(this.state.index, 1, values);
                this.setState({
                    setEditVisible: false
                });
            }
        });
    }

    delete() {
        const {code, rst, projectName,projectManager,pk,src1} = this.state;
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
        if(src1.length !== 0){
            delDocument({code:rst.related_documents[0].code})
            this.setState({
                src1:'',
            });
       }
    }

    goCancel() {
        this.setState({
            setVisible: false,
            setEditVisible: false
        });
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

    download() {
        let {code,src1} = this.state;
        if(src1.length !== 0){
        let apiGet = `${STATIC_DOWNLOAD_API}${src1}`;
        this.createLink(this,apiGet);
        }else{
            notification.warning({
                message: '当前节点未上传文档！',
            });
        }
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
        this.setState({
            code: selectedKeys[0],
            projectName: e.node.props.dataRef.title,
            e:e
        })
        if (!e.selected) {
            return
        }
        let datas = [],
            hasDoc;
        const {code}=this.state;
        getWorkpackages({ code: selectedKeys[0] }).then((rst) => {
            this.setState({
                rst: rst
            })
            if (rst === "object not found") {//单位工程施工包无信息
                return
            };
            if (rst.related_documents) {
                hasDoc = rst.related_documents.length !== 0;
            };
            if (hasDoc) {
                let len = rst.related_documents.length
                for (let i = 0; i < len; i++) {
                    if (rst.related_documents[i].name == "ZZJG") {
                        getDocument({ code: rst.related_documents[i].code }).then((doc) => {
                            this.setState({
                                hasdoc:true,
                                src1:doc.basic_params.files[0].a_file,
                                pk:doc.pk,
                                code1:rst.related_documents[i].code
                            });
                        })
                        hasDoc = false;
                        break;
                    }
                }
            } 
            if(hasDoc!==false){
                this.setState({src1:''});
                notification.warning({
                    message: '当前节点未上传文档！',
                });
            }
        })
    }
    handleChange = (values) => {
        if (values.file.status === 'done') {
            const { 
                actions: { 
                    postDocument,
                    getDocument,
                    setDocument,
                    getWorkpackages
                } 
            } = this.props;
            const {companyName,selectedKeys,e,rst,code,code1} = this.state;
            debugger
            let fileObj = {
                "a_file": values.file.response.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                "name": values.file.name,
                "download_url": values.file.response.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                "misc": "file",
            }
            debugger
            this.setState({fileObj});
            let postData = {
                "code": "safetytestfile"+moment().format("YYYYMMDDHHmmss"),
                "name": "ZZJG",
                "obj_type": "C_DOC",
                "workpackages":[{
                "pk":rst.pk,
                    "code": rst.code,
                    "obj_type": rst.obj_type
                }],
                "profess_folder": {"code": "folder_code", "obj_type":"C_DIR"},
                "extra_params": {
                    "createTime": moment().format("YYYY-MM-DD HH:mm:ss")
                },
                "basic_params": {
                    "files": [
                        fileObj
                    ]
                },
                "status": "A",
                "version": "A",
            }
            let postDataP = {
                "basic_params": {
                    "files": [
                        fileObj
                    ]
                },
                "status": "A",
                "version": "A",
            }
            let datas = [],
            hasDoc;
            getWorkpackages({code:code}).then((rst) => {
                this.setState({
                    rst:rst
                })
                if(rst == "object not found"){//单位工程施工包无信息
                    return
                }
                if(rst.related_documents){
                    hasDoc= rst.related_documents.length != 0;
                    let a=false;
                    if(hasDoc){
                        const {hasdoc}=this.state;
                        let len = rst.related_documents.length//JSON.parse(rst.extra_params.safetyPlan).length;
                        for(let i = 0;i<len;i++){
                            let values2 = {};
                            if(rst.related_documents[i].name == "ZZJG"){
                                a=true;
                            }
                        }
                    }    
                        if(a){
                            setDocument({code:code1},postDataP).then(rst=>{
                                debugger
                                console.log(code);
                                console.log(postDataP);
                                if(rst.status){
                                    notification.info({
                                        message: '更新成功！',
                                        duration: 2
                                    });
                                    this.setState({
                                        src1:rst.basic_params.files[0].a_file
                                    })
                                }else{
                                    notification.info({
                                        message: '更新失败！',
                                        duration: 2
                                    });
                                }
                            });
                        }else{
                            postDocument({},postData).then(rst=>{
                                if(rst.status){
                                    notification.info({
                                        message: '上传成功！',
                                        duration: 2
                                    });
                                    this.setState({
                                        src1:rst.basic_params.files[0].a_file
                                    }
                                    )
                                }else{
                                    notification.info({
                                        message: '上传失败！',
                                        duration: 2
                                    });
                                }
                        })
                    }   
             }
        })
    }
}
    onBtnClick = (type) =>{
        const {infoObj} = this.state;
        const { 
            actions: { 
                getDocument,
                delDocument
            } 
        } = this.props;
    }
    beforeUpload = (info) =>{
        const {code,e} = this.state;
        console.log(info);
        if(code){
            if(info.name.indexOf("pdf") !== -1 || info.name.indexOf("PDF") !== -1){
                return true;
            }else{
                    notification.warning({
                        message: '只能上传pdf文件！',
                        duration: 2
                    });
                    return false;
             }
        }else{
                    notification.warning({
                      message: '未选择目录树节点！',
                      duration: 2
                    });
                    return false;
         }
    }
    render() {
        const uploadProps = {
            name: 'file',
            action: `${FILE_API}/api/user/files/`,
            data(file) {
                return {
                    name: file.fileName,
                    a_file: file,
                };
            },
            onChange: this.handleChange,
            showUploadList:false,
            beforeUpload: this.beforeUpload,
        };
        const {infoObj,src1,url,mine_type} = this.state;
        let part = '';
        if(src1){
            part=src1;
        }
        let url1 = `${SOURCE_API}${part}`;
        return (
            <div>
                <DynamicTitle title="组织架构" {...this.props} />
                <Sidebar>
                    <WorkPackageTree {...this.props}
                        onSelect={this.onSelect.bind(this)} />
                </Sidebar>
                <Content>
                    <h1 style={{ textAlign: 'center', marginBottom: '25px' }}>安全生产组织架构</h1>
                    <Card style={{minHeight: 566}}>
                        {
                            src1 === ''?
                            <p>暂无文件</p>:
                            <iframe src={`/pdfjs/web/viewer.html?file=${url1}`}
                                width="100%" height="100%" scrolling="no" frameBorder="0" style={{minHeight:566}}/> 
                        }
                    </Card>
                    <Popconfirm
						placement="rightTop"
						title="确定删除吗？"
						onConfirm={this.delete.bind(this)}
						okText="确认"
						cancelText="取消">
                        <Button 
                            icon="delete"
                            type="primary"
                            style={{float:'right',marginLeft:10,marginTop:10}}>
                        删除
                        </Button>
					</Popconfirm>
                        <Button 
                            type="primary"
                            icon="download"
                            onClick={this.download.bind(this)}
                            style={{float:'right',marginLeft:10,marginTop:10}}>
                        下载
                        </Button>
                        <div style={{float:'right',marginTop:10}}>
                        <Upload {...uploadProps}>
                            <Button 
                             type="primary" 
                             icon="upload"
                             onClick={()=>this.onBtnClick("upload")}
                            >上传
                            </Button>
                        </Upload>
                    </div>
                </Content>
                <Preview />
            </div>
        );
    }
}
export default Form.create()(OrganizationalStructure);