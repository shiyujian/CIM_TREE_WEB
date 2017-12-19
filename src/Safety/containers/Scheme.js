import React, {Component, createElement} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions, getDocument} from '../store/scheme';
import {actions as fileActions} from '../store/staticFile';
import {actions as platformActions} from '_platform/store/global';
import WorkPackageTree from '../components/WorkPackageTree';
import { Button, Row, Col, Icon, Table, Input, message,notification, Select, Upload, Card, Popconfirm, Modal, Form,} from 'antd';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import {getUser} from '_platform/auth';
import { CUS_TILEMAP, SOURCE_API, STATIC_DOWNLOAD_API,previewWord_API,FILE_API} from '_platform/api';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

@connect(
	state => {
		const {safety: {scheme = {}} = {}, platform} = state;
		return {...scheme, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions,...previewActions, ...fileActions}, dispatch)
	})
)
class Scheme extends Component {
	static propTypes = {};
	constructor(props) {
		super(props);
		this.state = {
            setVisible: false,
            setEditVisible: false,
            dSource:[],
            record:{},
            code:'',
            hasDoc:false,
            rst:{},
            projectName:'',
            projectManager:'',
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

    initTree = () =>{
        const { actions: {
            getTree,
            getProjects, 
            setProjects, 
            getWorkpackages, 
            postDocument,
            getDocument,
            setDocument,
            delDocument
        } } = this.props;
        let{hasDoc,code,e}=this.state;
        getTree().then(res => {
            this.setState({
                code:res.children[0].children[0].code,
                projectName:res.children[0].children[0].name,
                e:res.children[0].children[0]
            });
            //获取 项目树 第一个子单位单位工程的文件
            getWorkpackages({code:res.children[0].children[0].code}).then((rst) => {
                this.setState({
                    rst:rst
                });
                if(rst.related_documents){
                    hasDoc= rst.related_documents.length !== 0;
                }
                if(hasDoc){   //hasDoc===true
                    let len = rst.related_documents.length;
                    for(let i = 0;i<len;i++){
                        let values = {};
                        if(rst.related_documents[i].name === "AQCHS"){
                            getDocument({code:rst.related_documents[i].code}).then((doc) => {
                                values.attachment = doc.basic_params.files[0];
                                this.setState({
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
         })
    }

    delete(){
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

    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    download(){
        // (data[index].attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '')
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
    
    onSelect(selectedKeys, e){
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
            code:selectedKeys[0],
            projectName:e.node.props.dataRef.title,
            e:e
        })
        if(!e.selected){
            return
        }
        let datas = [],
            hasDoc;
        const {code}=this.state;
        getWorkpackages({code:selectedKeys[0]}).then((rst) => {
            console.log('rst',rst);
            this.setState({
                rst:rst
            })
            if(rst == "object not found"){//单位工程施工包无信息
                return
            }
            if(rst.related_documents){
                hasDoc= rst.related_documents.length != 0;
            }
            if(hasDoc){
                let len = rst.related_documents.length//JSON.parse(rst.extra_params.safetyPlan).length;
                for(let i = 0;i<len;i++){
                    let values = {};
                    debugger
                    if(rst.related_documents[i].name == "AQCHS"){
                        getDocument({code:rst.related_documents[i].code}).then((doc) => {
                            values.attachment = doc.basic_params.files[0];
                            this.setState({
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
    /*静态服务器新逻辑*/
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
                "mime_type": values.file.response.mime_type
            }
            debugger
            this.setState({fileObj});
            let postData = {
                "code": "safetytestfile"+moment().format("YYYYMMDDHHmmss"),
                "name": "AQCHS",
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
                        let len = rst.related_documents.length//JSON.parse(rst.extra_params.safetyPlan).length;
                        for(let i = 0;i<len;i++){
                            let values2 = {};
                            let a=false;
                            debugger
                            if(rst.related_documents[i].name == "AQCHS"){
                                a=true;
                            }
                        }
                    }    
                        if(a){
                            setDocument({code:code1},postDataP).then(rst=>{
                                if(rst.status){
                                    notification.info({
                                        message: '更新成功！',
                                        duration: 2
                                    });
                                    this.setState({
                                        src1:rst.basic_params.files[0].a_file
                                    }
                                    )
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
        const {infoObj,src1,url} = this.state;
        let part = '';
        if(src1){
            part=src1;
        }
        let url1 = `${SOURCE_API}${part}`;
		return (
			<div>
				<DynamicTitle title="安全策划书" {...this.props}/>
				<Sidebar>
					<WorkPackageTree {...this.props}
                     onSelect={this.onSelect.bind(this)} />
				</Sidebar>
				<Content>
                    <h1 style={{ textAlign: 'center', marginBottom: '25px' }}>安全策划书</h1>
					<Card style={{minHeight: 566}}>
                        {
                            src1 === ''?
                            <p>暂无文件</p>:
                            <iframe src={`/pdfjs/web/viewer.html?file=${url1}`}
                                width="100%" height="100%" scrolling="no" frameBorder="0" style={{minHeight: 566}}/>
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
                <Preview/>
			</div>
		);
	}
}
export default Form.create()(Scheme);