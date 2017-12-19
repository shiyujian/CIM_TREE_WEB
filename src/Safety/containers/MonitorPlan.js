import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import AddFile from '../components/Discipline/AddFile'
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store/safetyMonitor';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {getUser} from '_platform/auth';
import {SOURCE_API, STATIC_DOWNLOAD_API,FILE_API} from '_platform/api';
import moment from 'moment';
import '_platform/components/layout/Preview.less';
import {
    Upload,
    Row,
    Col,
    Card,
    Modal,
    Button,
    Input,
    Popconfirm,
    notification
} from 'antd';
const Search = Input.Search;

@connect(
    state => {
        const {platform,safety:{safetyMonitor={}} = {}} = state;
        return {platform,safetyMonitor}
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions}, dispatch)
    })
)

class MonitorPlan extends Component {
    static propTypes = {};
    constructor(){
        super();
        this.state = {
            project:{},
            unitProject:{},
            construct:{},
            fileObj:{},
            companyName:'',
            infoObj:{}
        }
    }

    componentDidMount(){
        const { 
            actions: { 
                getComByOrgCode,
                getProjectTree,
                getSchemes
            } 
        } = this.props;
        const user = getUser();
        const code = user.org_code;
        if(code===""){
            return;
        }
        getComByOrgCode({code:code}).then((rst) =>{
            if(rst.status){
                let children = rst.children;
                let companyName = children[0].name;
                this.setState({companyName});
                debugger
            }
        });
        debugger
        getProjectTree({},{depth:2}).then((rst)=>{
            debugger
            if(rst && rst.children && rst.children.length>0){
                let project=rst.children;
                let unitProject = {};
                for(var i=0;i<project.length;i++){
                    if(project[i].children.length>0){
                        unitProject=project[i].children[0];
                        this.setState({
                            unitProject:unitProject,
                            project:project[i],
                        });
                        break;
                    }
                }
                getSchemes({},{unit:unitProject.code}).then(rst =>{
                    debugger
                    if(rst.results.length!==0){
                        this.setState({infoObj:rst.results[0]});
                    }else{
                        this.setState({infoObj:{}});
                        notification.warning({
                            message: '当前节点未上传文档！',
                            duration: 2
                        });
                    }
                });
            }
        });
    }

    deletet(record,index){
        let datas = this.state.dataSet;
        const {code, rst, projectName,projectManager} = this.state;
        const { 
            actions: { 
                delDocument
            } 
        } = this.props;
        delDocument({code:datas[index].docCode})
        datas.splice(index,1);
        this.setState({dataSet:datas});
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

    onSelect = (project,unitProject)=>{
        debugger
        const { 
            actions: { 
                getSchemes
            } 
        } = this.props;
        if(unitProject){
            this.setState({project,unitProject});
        }else{
            return;
        }
        getSchemes({},{unit:unitProject.code}).then(rst =>{
            if(rst.results.length!==0){
                this.setState({infoObj:rst.results[0]});
            }else{
                this.setState({infoObj:{}});
                notification.warning({
                    message: '当前节点未上传文档！',
                    duration: 2
                });
            }
        });
    };

    handleChange = (info) => {
        if (info.file.status === 'done') {
            const { 
                actions: { 
                    postSchemes,
                    getSchemes,
                    patchSchemes
                } 
            } = this.props;
            debugger
            const {companyName,project,unitProject} = this.state;
            let fileObj = {
                "a_file": info.file.response.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                "name": info.file.name,
                "download_url": info.file.response.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                "misc": "file",
                "mime_type": info.file.response.mime_type
            }
            debugger
            this.setState({fileObj});
            let postData = {
                project:project.name,
                unit:unitProject.code,
                department:companyName,
                file:fileObj,
                upload_time:moment(new Date()).add(8,'hours').unix(),
            };
            debugger
            let postDataP = {
                file:fileObj
            }
            getSchemes({},{unit:unitProject.code}).then(rst =>{
                if(rst.results.length!==0){
                    patchSchemes({pk:rst.results[0]._id},postDataP).then((result)=>{
                        if(result._id){
                            notification.info({
                                message: '更新成功！',
                                duration: 2
                            });
                            debugger
                            this.setState({infoObj:result});
                        }else{
                            notification.warning({
                                message: '更新失败！',
                                duration: 2
                            });
                        }
                    });
                }else{
                    postSchemes({},postData).then((result) =>{
                        if(result._id){
                            notification.info({
                                message: '上传成功！',
                                duration: 2
                            });
                            debugger
                            this.setState({infoObj:result});
                        }else{
                            notification.warning({
                                message: '上传失败！',
                                duration: 2
                            });
                        }
                    });
                }
            });
            
        }
    }

    beforeUpload = (info) =>{
        const {project,unitProject} = this.state;
        if(project.code&&unitProject.code){
            return true;
        }else{
            debugger
            notification.warning({
                message: '未选择目录树节点！',
                duration: 2
            });
            return false;
        }
        if(info.name.indexOf("pdf") !== -1 || info.name.indexOf("PDF") !== -1){
            return true;
        }else{
            notification.warning({
                message: '只能上传pdf文件！',
                duration: 2
            });
            return false;
        }
    }

    onBtnClick = (type) =>{
        const {infoObj} = this.state;
        const { 
            actions: { 
                getSchemes,
                deleteSchemes
            } 
        } = this.props;
        if(type==="delete"){
            if(!infoObj._id){
                notification.warning({
                    message: '当前无文件可以删除！',
                    duration: 2
                });
            }
            deleteSchemes({pk:infoObj._id}).then((rst) =>{
                if(rst===""){
                    notification.warning({
                        message: '删除成功！',
                        duration: 2
                    });
                    this.setState({infoObj:{}});
                }
            });
        }else if(type==="download"){
            let apiGet = `${STATIC_DOWNLOAD_API}` + infoObj.file.download_url;
            this.createLink(this,apiGet);
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
        const {infoObj} = this.state;
        let part = '';
        if(infoObj.file){
            part = infoObj.file.a_file;
        }
        let url = `${SOURCE_API}${part}`;
        let projectName = infoObj.project?infoObj.project:'';
        let department = infoObj.department?infoObj.department:'';
        let time = infoObj.upload_time?infoObj.upload_time.slice(0,10):'';
        return (
            <div>
                <DynamicTitle title="监测方案" {...this.props}/>
                <Sidebar>
                    <div style={{overflow:'hidden'}} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
                    </div>
                </Sidebar>
                <Content>
                    <h1 style={{textAlign:'center'}}>监测方案</h1>
                    <Row>
                        <Col span={8}>
                            <Row style={{marginTop:20}}>
                                <Col span={4}>
                                    <p style={{fontSize:14}}>工程名称</p>
                                </Col>
                                <Col span={18}>
                                    <Input style={{width:'100%'}} value={`${projectName}`} disabled/>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row style={{marginTop:20}}>
                                <Col span={4}>
                                    <p style={{fontSize:14}}>监测单位</p>
                                </Col>
                                <Col span={18}>
                                    <Input style={{width:'100%'}} value={`${department}`} disabled/>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row style={{marginTop:20}}>
                                <Col span={4}>
                                    <p style={{fontSize:14}}>上传日期</p>
                                </Col>
                                <Col span={18}>
                                    <Input 
                                     style={{width:'100%'}} 
                                     value={`${time}`}
                                     disabled/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Card style={{marginTop:20,height:666}}>
                        {part === '' ? <p>暂无可预览文件</p>:
                    <iframe src={`/pdfjs/web/viewer.html?file=${url}`}
                               width="100%" height="100%" scrolling="no" frameBorder="0" style={{minHeight: 566}}/>}
                    </Card>
                    <Button 
                     type="primary" 
                     style={{float:'right',marginLeft:10,marginTop:10}}
                     icon="download"
                     onClick={()=>this.onBtnClick("download")}
                    >下载
                    </Button>
                    <Popconfirm
                        placement="rightTop"
                        title="确定删除吗？"
                        onConfirm={()=>this.onBtnClick("delete")}
                        okText="确认"
                        cancelText="取消">
                        <Button 
                         type="primary" 
                         style={{float:'right',marginLeft:10,marginTop:10}}
                         icon="delete"
                        >删除
                        </Button>
                    </Popconfirm>
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
            </div>
        );
    }
}
export default MonitorPlan;