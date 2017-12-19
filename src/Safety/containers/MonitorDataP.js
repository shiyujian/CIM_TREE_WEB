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
// import ProjectTree from '../components/Treatment/ProjectTree';
import WorkPackageTree from '../components/WorkPackageTree';
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
    Popconfirm
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
            projectName:'',
            code:'',
            rst:{}
        }
    }

    onViewClick(record,index){
        const { actions: { openPreview } } = this.props;
        let data = this.state.dataSet;
        let filed = {};
        debugger
        //if(record.attachment[index].size){
            filed.misc = data[index].attachment.misc;
            filed.a_file = `${SOURCE_API}` + (data[index].attachment.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            filed.download_url = `${STATIC_DOWNLOAD_API}` + (data[index].attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            filed.name = data[index].attachment.name;
            filed.mime_type = data[index].attachment.mime_type;
            openPreview(filed);
        // }else{
        //     openPreview(data[index].attachment);
        // }
    }
    deletet(record,index){
        let datas = this.state.dataSet;
        const {code, rst, projectName,projectManager} = this.state;
        const { 
            actions: { 
                delDocument
            } 
        } = this.props;
        debugger
        //let c = datas[index].docCode;
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

    onDownClick(record,index){
        let data = this.state.dataSet;
        debugger
        let apiGet = `${STATIC_DOWNLOAD_API}` + (data[index].attachment.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        this.createLink(this,apiGet);
    }

    onAddClick(record,index){
        this.setState({newKey: Math.random(),setEditVisiable:true})
    }

    goCancel(){
        this.setState({setEditVisiable:false});
    }

    setEditData(){
        const {code, rst, projectName,solution} = this.state;
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
        let datas = this.state.dataSet;
        this.props.form.validateFields((err,values) => {
            if(!err){
                let len = values.attachment.length;
                for(let i=0;i<len;i++){
                    datas.push(values);
                    let projectData = {
                        "code": "safetytestfile"+moment().format("YYYYMMDDHHmmss")+i,
                        "name": "AQGC",
                        "obj_type": "C_DOC",
                        "workpackages":[{
                            "pk":rst.pk,
                            "code": rst.code,
                            "obj_type": rst.obj_type
                        }],
                        "profess_folder": {"code": "folder_code", "obj_type":"C_DIR"},
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
                    postDocument({}, projectData);
                }
                this.setState({setEditVisiable:false,dataSet:datas});
            }
        }); 
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

        this.setState({
            code: selectedKeys[0],
            projectName: e.node.props.dataRef.title,
        });
        if (!e.selected) {
            return
        }
        let datas = [],hasDoc;
        getWorkpackages({code:selectedKeys[0]}).then((rst) => {
            console.log('rst',rst);
            this.setState({
                rst:rst
            })
            if(rst == "object not found"){//单位工程施工包无信息
                this.setState({
                    dataSet: []
                });
                return
            }
            debugger
            if(rst.related_documents){
                hasDoc= rst.related_documents.length != 0;
            }else{
                this.setState({
                    dataSet: []
                });
                return
            }
            if(hasDoc){
                let len = rst.related_documents.length//JSON.parse(rst.extra_params.safetyPlan).length;
                for(let i = 0;i<len;i++){
                    let values = {};
                    debugger
                    values.projectName = e.node.props.dataRef.title;
                    if(rst.related_documents[i].name === "AQGC"){
                        getDocument({code:rst.related_documents[i].code}).then((doc) => {
                            values.attachment = doc.basic_params.files[0];
                            values.docCode = rst.related_documents[i].code;
                            datas.push(values);
                            this.setState({
                                dataSet:datas
                            });
                        })
                    }else{
                        this.setState({
                            dataSet: []
                        });
                    }
                }     
            }else{
                this.setState({
                    dataSet: []
                });
            }
        })
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
                width: '70%'
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
                <WorkPackageTree {...this.props}
                     onSelect={this.onSelect.bind(this)} />
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