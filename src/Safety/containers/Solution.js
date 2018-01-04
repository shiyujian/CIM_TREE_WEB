import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions } from '../store/staticFile';
import AddSolution from '../components/Solution/AddSolution'
import { actions as platformActions } from '_platform/store/global';
import styles from './RiskEvaluation.css';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import { actions as schemeActions } from '../store/scheme';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import { SOURCE_API, STATIC_DOWNLOAD_API } from '_platform/api';
import moment from 'moment';
import {
    Table,
    Form,
    Modal,
    Button,
    Select,
    Input,
    Popconfirm,
    notification,
} from 'antd';
const Search = Input.Search;

@connect(
    state => {
        const { safety: { staticFile = {} } = {}, platform, safety: { scheme = {} } = {} } = state;
        return { staticFile, platform, scheme }
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions, ...schemeActions }, dispatch)
    })
)

class Solution extends Component {
    static propTypes = {};
    constructor() {
        super();
        this.state = {
            record: {},
            setAddVisiable: false,
            index: '-1',
            selectedRowKeys: [],
            dataSet: [],
            newKey: Math.random(),
            projectName: '',
            roots:{},
            totalDir:null,
            project:{},
            unitProject:{},
            construct:{}
        }
    }

    componentDidMount(){
        const { 
            actions: { 
                getProjectTree,
                getScheduleDir,
                postScheduleDir
            } 
        } = this.props;
        getProjectTree({},{depth:1}).then((rst)=>{
            this.setState({roots:rst});
            let name = rst.name;
            let code = "safety_solution_dir_"+rst.code;
            let getDirData = {
                code:code
            }
            let postDirData = {
                "name": name,
                "code": code,
                "obj_type": "C_DIR",
                "status": "A",
                "extra_params": {}
            }
            getScheduleDir(getDirData).then( (rst)=>{
                if(rst && rst.obj_type){
                    console.log('存在目录',rst)
                    this.setState({
                        totalDir:{
                            pk:rst.pk,
                            code:rst.code,
                            obj_type:rst.obj_type
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
                                obj_type:value.obj_type
                            }
                        })
                    })
                }
            });
        });
    }

    onViewClick(record, index) {
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

    delete(record,index){
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

    onDownClick(record, index) {
        let apiGet = `${STATIC_DOWNLOAD_API}` + (record.attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        this.createLink(this,apiGet);
    }

    goCancel() {
        this.setState({ setAddVisiable: false });
    }

    setAddData() {
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
        let code = "safety_solution_dir_"+project.code;

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
        this.props.form.validateFields((err, values) => {
            if (!err) {
                getScheduleDir({code:code}).then((rst)=>{
                    if(rst&&rst.obj_type){    //存在当前目录
                        let projectData = {
                            "code": "safetytestfile"+moment().format("YYYYMMDDHHmmss"),
                            "name": values.solution,
                            "obj_type": "C_DOC",
                            "workpackages":[{
                                "pk":rst.pk,
                                "code": rst.code,
                                "obj_type": rst.obj_type
                            }],
                            "extra_params": {
                                "solution": values.solution,
                                "projectName":values.projectName,
                                "constructionUnit":values.constructionUnit,
                                "portion":values.portion,
                            },
                            "profess_folder": {"code": code, "obj_type":"C_DIR"},
                            "basic_params": {
                                "files": [
                                    {
                                      "a_file": values.attachment[0].a_file,
                                      "name": values.attachment[0].name,
                                      "download_url": values.attachment[0].download_url,
                                      "misc": "file",
                                      "mime_type": values.attachment[0].mime_type
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
                                        data.projectName = rep.result[i].extra_params.projectName;
                                        data.solution = rep.result[i].extra_params.solution;
                                        data.constructionUnit = rep.result[i].extra_params.constructionUnit;
                                        data.portion = rep.result[i].extra_params.portion;
                                        data.attachment = rep.result[i].basic_params.files[0];
                                        data.code = rep.result[i].code;
                                        dataSet.push(data);
                                    }
                                    this.setState({dataSet});
                                });
                            }
                        });
                        this.setState({setAddVisiable:false});
                    }else{
                        postScheduleDir({},postDirData).then((value) =>{   //创建目录
                            if(value && value.code){   //创建目录成功
                                let projectData = {
                                    "code": "safetytestfile"+moment().format("YYYYMMDDHHmmss"),
                                    "name": values.solution,
                                    "obj_type": "C_DOC",
                                    "workpackages":[{
                                        "pk":rst.pk,
                                        "code": rst.code,
                                        "obj_type": rst.obj_type
                                    }],
                                    "extra_params": {
                                        "solution": values.solution,
                                        "projectName":values.projectName,
                                        "constructionUnit":values.constructionUnit,
                                        "portion":values.portion,
                                    },
                                    "profess_folder": {"code": code, "obj_type":"C_DIR"},
                                    "basic_params": {
                                        "files": [
                                            {
                                              "a_file": values.attachment[0].a_file,
                                              "name": values.attachment[0].name,
                                              "download_url": values.attachment[0].download_url,
                                              "misc": "file",
                                              "mime_type": values.attachment[0].mime_type
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
                                                data.projectName = rep.result[i].extra_params.projectName;
                                                data.solution = rep.result[i].extra_params.solution;
                                                data.constructionUnit = rep.result[i].extra_params.constructionUnit;
                                                data.portion = rep.result[i].extra_params.portion;
                                                data.attachment = rep.result[i].basic_params.files[0];
                                                data.code = rep.result[i].code;
                                                dataSet.push(data);
                                            }
                                            this.setState({dataSet});
                                        });
                                    }
                                });
                                this.setState({setAddVisiable:false});
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
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    onAddClick = () => {
        const {unitProject} = this.state;
        if(!unitProject.name){
            notification.warning({
                message: '请选择一个节点信息！',
                duration: 2
            });
            return;
        }
        this.setState({ setAddVisiable: true, newKey: Math.random() });
    }
    onConfirm = () => {
        const { selectedRowKeys } = this.state;
        let array = [];
        let len = this.state.dataSet.length;
        for (let i = 0; i < len; i++) {
            if (selectedRowKeys.indexOf(i) === -1) {
                array.push(this.state.dataSet[i]);
            }
        }
        this.setState({ dataSet: array });
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
                getDocumentByCode,
                getWorkpackagesByCode
            } 
        } = this.props;
        if(unitProject){
            this.setState({project,unitProject});
            getWorkpackagesByCode({code:unitProject.code}).then(rst =>{
                if(rst.code){
                    if(rst.extra_params && rst.extra_params.unit){
                        for(let i=0;i<rst.extra_params.unit.length;i++){
                            // if(rst.extra_params.unit[i].type==="施工单位/C"){
                            if(rst.extra_params.unit[i].type==="施工单位"){
                                this.setState({construct:rst.extra_params.unit[i]});
                            }
                        }
                    }
                }
            });
        }else{
            return;
        }
        debugger
        let code = "safety_solution_dir_"+project.code;
        let dataSet = [];
        getDocumentByCode({code:code}).then((rep)=>{
            for(let i=0;i<rep.result.length;i++){
                let data = {};
                data.projectName = rep.result[i].extra_params.projectName;
                data.solution = rep.result[i].extra_params.solution;
                data.constructionUnit = rep.result[i].extra_params.constructionUnit;
                data.portion = rep.result[i].extra_params.portion;
                data.attachment = rep.result[i].basic_params.files[0];
                data.code = rep.result[i].code;
                dataSet.push(data);
            }
            this.setState({dataSet});
        });
    }

    onSearch = (value) =>{
        const {project} = this.state;
        let code = "safety_solution_dir_"+project.code;
        const { 
            actions: { 
                getDocumentByContent
            } 
        } = this.props;
        let dataSet = [];
        getDocumentByContent({code:code,name:value}).then((rep)=>{
            for(let i=0;i<rep.result.length;i++){
                let data = {};
                data.projectName = rep.result[i].extra_params.projectName;
                data.solution = rep.result[i].extra_params.solution;
                data.constructionUnit = rep.result[i].extra_params.constructionUnit;
                data.portion = rep.result[i].extra_params.portion;
                data.attachment = rep.result[i].basic_params.files[0];
                data.code = rep.result[i].code;
                dataSet.push(data);
            }
            this.setState({dataSet});
        });
    }

    render() {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const dataSet = this.state.dataSet;
        const { selectedRowKeys } = this.state;
        const hasSelected = selectedRowKeys.length > 0;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                width: '10%',
                render: (text, record, index) => {
                    return <div>{index + 1}</div>
                }
            }, {
                title: '专项方案',
                dataIndex: 'solution',
                width: '35%'
            }, {
                title: '工程名称',
                dataIndex: 'projectName',
                width: '20%'
            }, {
                title: '分部分项',
                dataIndex: 'portion',
                width: '20%'
            }, {
                title: '操作',
                dataIndex: 'opt',
                width: '15%',
                render: (text, record, index) => {
                    return <div>
                        <a href='avascript:;' onClick={this.onViewClick.bind(this, record, index)}>预览</a>
                        <span className="ant-divider" />
                        <a href="javascript:;" onClick={this.onDownClick.bind(this, record, index)}>下载</a>
                        <span className="ant-divider" />
                        <Popconfirm
						 placement="rightTop"
						 title="确定删除吗？"
						 onConfirm={this.delete.bind(this, record, index)}
						 okText="确认"
						 cancelText="取消">
						<a>删除</a>
					</Popconfirm>
                    </div>
                }
            }
        ];
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div className={styles.riskevaluation}>
                <DynamicTitle title="专项方案" {...this.props} />
                <Sidebar>
                    <div style={{overflow:'hidden'}} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
                    </div>
                </Sidebar>
                <Content>
                    <h1 style={{ textAlign: 'center' }}>专项安全施工组织设计（方案）</h1>
                    <Search
                        placeholder="请输入搜索关键词"
                        style={{ width: '80%', display: 'block' }}
                        onSearch={(value) => this.onSearch(value)}
                    >
                    </Search>
                    <Button
                        icon="plus"
                        type="primary"
                        style={{ float: 'right' }}
                        onClick={() => this.onAddClick()}
                    >
                        添加
                    </Button>
                    <Table
                        columns={columns}
                        //rowSelection={rowSelection}
                        dataSource={dataSet}
                        bordered
                        style={{ height: 380, marginTop: 40 }}
                        pagination={{ pageSize: 10 }}
                    />
                </Content>
                <Preview />
                <Modal
                    title="专项安全施工组织设计（方案）"
                    width={760}
                    key={this.state.newKey}
                    visible={this.state.setAddVisiable}
                    onOk={this.setAddData.bind(this)}
                    onCancel={this.goCancel.bind(this)}
                >
                    <AddSolution props={this.props} state={this.state} />
                </Modal>
            </div>
        );
    }
}
export default Form.create()(Solution);