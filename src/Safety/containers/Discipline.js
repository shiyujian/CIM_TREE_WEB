import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/staticFile';
import AddFile from '../components/Discipline/AddFile'
import {actions as platformActions} from '_platform/store/global';
import styles from './RiskEvaluation.css';
import {actions as schemeActions} from '../store/scheme';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {SOURCE_API, STATIC_DOWNLOAD_API} from '_platform/api';
import moment from 'moment';
import {
    Table,
    Row,
    Col,
    Form,
    Modal,
    Button,
    Input,
    Popconfirm,
    notification
} from 'antd';
const Search = Input.Search;

@connect(
    state => {
        const {safety: {staticFile = {}} = {}, platform,safety:{scheme={}} = {}} = state;
        return {staticFile, platform,scheme}
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions,...schemeActions}, dispatch)
    })
)

class Discipline extends Component {
    static propTypes = {};
    constructor(){
        super();
        this.state = {
            record:{},
            setEditVisiable:false,
            index:'-1',
            dataSet:[],
            newKey: Math.random(),
            roots:{},
            totalDir:null,
            project:{},
            unitProject:{}
        }
    }

    componentDidMount(){
        const { 
            actions: { 
                getProjectTree,
                getScheduleDir,
                postScheduleDir,
            } 
        } = this.props;
        getProjectTree({},{depth:1}).then((rst)=>{
            this.setState({roots:rst});
            let name = rst.name;
            let code = "safety_disclipline_dir_"+rst.code;
            let getDirData = {
                code:code
            }
            let postDirData = {
                "name": name,
                "code": code,
                "obj_type": "C_DIR",
                "status": "A",
                "extra_params": {},
            }
            getScheduleDir(getDirData).then( (rst)=>{
                if(rst && rst.obj_type){
                    console.log('存在目录',rst)
                    this.setState({
                        totalDir:{
                            pk:rst.pk,
                            code:rst.code,
                            obj_type:rst.obj_type,
                        }
                    })
                }else{
                    console.log('不存在目录',rst)
                    postScheduleDir({},postDirData).then((value)=>{
                        console.log('创建目录',value)
                        this.setState({
                            totalDir:{
                                pk:value.pk,
                                code:value.code,
                                obj_type:value.obj_type,
                            }
                        })
                    })
                }
            });
        });
    }

    onViewClick(record,index){
        const { actions: { openPreview } } = this.props;
        debugger
        let filed = {};
        filed.misc = record.attachment.misc;
        filed.a_file = `${SOURCE_API}` + (record.attachment.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (record.attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = record.attachment.name;
        filed.mime_type = record.attachment.mime_type;
        openPreview(filed);
    }
    deletet(record,index){
        let datas = this.state.dataSet;
        const { 
            actions: { 
                delDocument
            } 
        } = this.props;
        delDocument({code:record.code});
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

    onDownClick(record,index){
        let apiGet = `${STATIC_DOWNLOAD_API}` + (record.attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        this.createLink(this,apiGet);
    }

    onAddClick(record,index){
        const {unitProject} = this.state;
        if(!unitProject.name){
            notification.warning({
                message: '请选择一个节点信息！',
                duration: 2
            });
            return;
        }
        this.setState({newKey: Math.random(),setEditVisiable:true})
    }

    goCancel(){
        this.setState({setEditVisiable:false});
    }

    setEditData(){
        const {totalDir,project,unitProject} = this.state;

        const { 
            actions: { 
                getProjects, 
                setProjects, 
                getWorkpackages, 
                postDocument,
                getDocument,
                setDocument,
                delDocument,
                getScheduleDir,
                postScheduleDir,
                getDocumentByCode
            } 
        } = this.props;
        let name = project.name;
        let code = "safety_disclipline_dir_"+project.code;

        let getDirData = {
            code:code,
        }
        //创建目录
        let postDirData = {
            "name": name,
            "code": code,
            "obj_type": "C_DIR",
            "status": "A",
            "extra_params": {},
            "parent": {"pk":totalDir.pk,"code":totalDir.code,"obj_type":totalDir.obj_type}
        }
        this.props.form.validateFields((err,values) => {
            if(!err){
                getScheduleDir({code:code}).then((rst)=>{
                    if(rst&&rst.obj_type){    //存在当前目录
                        let len = values.attachment.length;
                        for(let i=0;i<len;i++){
                            let projectData = {
                                "code": "safetytestfile"+moment().format("YYYYMMDDHHmmss")+i,
                                "name": values.attachment[i].name,
                                "obj_type": "C_DOC",
                                "workpackages":[{
                                    "pk":rst.pk,
                                    "code": rst.code,
                                    "obj_type": rst.obj_type
                                }],
                                "extra_params": {
                                    "AQGC": values.attachment[i].name,
                                },
                                "profess_folder": {"code": code, "obj_type":"C_DIR"},
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
                            postDocument({}, projectData).then((result)=>{
                                if(result.obj_type){
                                    notification.warning({
                                        message: '创建文档成功！',
                                        duration: 2
                                    });
                                    let dataSet = [];
                                    getDocumentByCode({code:code}).then((rep)=>{
                                        for(let i=0;i<rep.result.length;i++){
                                            let data = {};
                                            data.projectName = rep.result[i].basic_params.files[0].name;
                                            data.attachment = rep.result[i].basic_params.files[0];
                                            data.code = rep.result[i].code;
                                            dataSet.push(data);
                                        }
                                        this.setState({dataSet});
                                    });
                                }
                            });
                        }
                        this.setState({setEditVisiable:false});
                    }else{
                        postScheduleDir({},postDirData).then((value) =>{   //创建目录
                            if(value && value.code){   //创建目录成功
                                let len = values.attachment.length;
                                for(let i=0;i<len;i++){
                                    let projectData = {
                                        "code": "safetytestfile"+moment().format("YYYYMMDDHHmmss")+i,
                                        "name": values.attachment[i].name,
                                        "obj_type": "C_DOC",
                                        "workpackages":[{
                                            "pk":rst.pk,
                                            "code": rst.code,
                                            "obj_type": rst.obj_type
                                        }],
                                        "extra_params": {
                                            "AQGC": values.attachment[i].name,
                                        },
                                        "profess_folder": {"code": code, "obj_type":"C_DIR"},
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
                                    postDocument({}, projectData).then((result)=>{
                                        if(result.obj_type){
                                            notification.warning({
                                                message: '创建文档成功！',
                                                duration: 2
                                            });
                                            let dataSet = [];
                                            getDocumentByCode({code:code}).then((rep)=>{
                                                for(let i=0;i<rep.result.length;i++){
                                                    let data = {};
                                                    data.projectName = rep.result[i].basic_params.files[0].name;
                                                    data.attachment = rep.result[i].basic_params.files[0];
                                                    data.code = rep.result[i].code;
                                                    dataSet.push(data);
                                                }
                                                this.setState({dataSet});
                                            });
                                        }
                                    });
                                }
                                this.setState({setEditVisiable:false});
                            }else{
                                notification.warning({
                                    message: '未成功创建文件目录，请重试！',
                                    duration: 2
                                });
                            }
                        });
                    }
                });
            }
        }); 
    }

    onSelect(project, unitProject){
        const { 
            actions: { 
                getProjects, 
                setProjects, 
                getWorkpackages, 
                postDocument,
                getDocument,
                setDocument,
                delDocument,
                getDocumentByCode
            } 
        } = this.props;
        if(unitProject){
            this.setState({project,unitProject});
        }else{
            return;
        }
        debugger
        let code = "safety_disclipline_dir_"+project.code;
        let dataSet = [];
        getDocumentByCode({code:code}).then((rep)=>{
            for(let i=0;i<rep.result.length;i++){
                let data = {};
                data.projectName = rep.result[i].basic_params.files[0].name;
                data.attachment = rep.result[i].basic_params.files[0];
                data.code = rep.result[i].code;
                dataSet.push(data);
            }
            this.setState({dataSet});
        });
    }
    onSearch = (value) =>{
        const {project} = this.state;
        let code = "safety_disclipline_dir_"+project.code;
        const { 
            actions: { 
                getDocumentByContent,
            } 
        } = this.props;
        let dataSet = [];
        getDocumentByContent({code:code,name:value}).then((rep)=>{
            for(let i=0;i<rep.result.length;i++){
                let data = {};
                data.projectName = rep.result[i].basic_params.files[0].name;
                data.attachment = rep.result[i].basic_params.files[0];
                data.code = rep.result[i].code;
                dataSet.push(data);
            }
            this.setState({dataSet});
        });
    }

    render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        const dataSet = this.state.dataSet;
        const columns = [
            {
                title:'序号',
                dataIndex:'index',
                width: '15%',
                render:(text,record,index) => {
                    return <div>{index+1}</div>
                }
            },{
                title:'安全规程',
                dataIndex:'projectName',
                width: '70%',
            },{
                title:'操作',
                dataIndex:'opt',
                width: '15%',
                render: (text,record,index) => {
                    return <div>
                              <a href='javascript:;' onClick={this.onViewClick.bind(this,record,index)}>预览</a>
                              <span className="ant-divider" />
                              <a href="javascript:;" onClick={this.onDownClick.bind(this,record,index)}>下载</a>
                              <span className="ant-divider" />
                                <Popconfirm
                                 placement="rightTop"
                                 title="确定删除吗？"
                                 onConfirm={this.deletet.bind(this, record, index)}
                                 okText="确认"
                                 cancelText="取消">
                                 <a>删除</a>
                                </Popconfirm>
                            </div>
                }
            }
        ];
                    
        return (
            <div className={styles.riskevaluation}>
                <DynamicTitle title="安全规程" {...this.props}/>
                <Sidebar>
                    <div style={{overflow:'hidden'}} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
                    </div>
                </Sidebar>
                <Content>
                    <h1 style={{textAlign:'center'}}>安全规程</h1>
                    <Search
                     placeholder="请输入搜索关键词"
                     style={{width:'80%',display:'block',marginTop:15}}
                     onSearch={(value)=>this.onSearch(value)}
                    ></Search>
                    <Button 
                     icon="plus" 
                     type="primary" 
                     style={{float:'right'}}
                     onClick={()=>this.onAddClick()}
                     >
                     添加
                    </Button>
                    <Table 
                     columns={columns} 
                     dataSource={dataSet}
                     bordered
                     style={{height:380,marginTop:40}}
                     pagination = {{pageSize:10}} 
                    />
                </Content>
                <Modal
                 title="安全操作规程"
                 width={760}
                 key={this.state.newKey}
                 visible={this.state.setEditVisiable}
                 onOk={this.setEditData.bind(this)}
                 onCancel={this.goCancel.bind(this)}
                >
                    <AddFile props={this.props} state={this.state} />
                </Modal>
                <Preview/>
            </div>
        );
    }
}
export default Form.create()(Discipline);