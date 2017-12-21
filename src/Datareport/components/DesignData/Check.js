import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../store/DesignData';
import {actions as platformActions} from '_platform/store/global';
import { Modal, Input, Form, Button, message, Table, Radio, Row, Col,DatePicker,Select } from 'antd';
import WorkflowHistory from '../WorkflowHistory'
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import {getUser} from '_platform/auth';
import Preview from '../../../_platform/components/layout/Preview';
import { CODE_PROJECT } from '_platform/api';
import '../index.less'; 

const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;
const {Option} = Select
const { TextArea } = Input;
@connect(
	state => {
		const {datareport: {designdata = {}} = {}, platform} = state;
		return {...designdata, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class Check extends Component {

	constructor(props) {
		super(props);
		this.state = {
            wk:null,
            dataSource:[],
            opinion:1,//1表示通过 2表示不通过
		};
    }
    async componentDidMount(){
        const {wk} = this.props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({dataSource,wk})
    }

    componentWillReceiveProps(props){
        const {wk} = props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({dataSource,wk})
   }
   //提交
    async submit(){
        if(this.state.opinion === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        this.props.closeModal("design_check_visbile",false)
        message.info("操作成功")
    }
    //通过
    async passon(){
        const {dataSource,wk} = this.state
        const {actions:{logWorkflowEvent,updateWpData,addDocList,putDocList}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
        let doclist_a = [];
        let doclist_p = [];
        let wplist = [];
        dataSource.map((o) => {
            //创建文档对象
            let doc = o.related_documents.find(x => {
                return x.rel_type === 'many_jyp_rel'
            })
            if(doc){
                doclist_p.push({
                    code:doc.code,
                    extra_params:{
                        ...o
                    }
                })
            }else{
                doclist_a.push({
                    code:`rel_doc_${o.code}`,
                    name:`rel_doc_${o.pk}`,
                    obj_type:"C_DOC",
                    status:"A",
                    version:"A",
                    "basic_params": {
                        // "files": [
                        //     {
                        //     "a_file": file.a_file,
                        //     "name": file.name,
                        //     "download_url": file.download_url,
                        //     "misc": file.misc,
                        //     "mime_type": file.mime_type
                        //     },
                        // ]
                    },
                    workpackages:[{
                        code:o.code,
                        obj_type:o.obj_type,
                        pk:o.pk,
                        rel_type:"many_jyp_rel"
                    }],
                    extra_params:{
                        ...o
                    }
                })
            }
            //施工包批量
            wplist.push({
                code:o.code,
                extra_params:{
                    rate:o.rate,
                    check_status:2
                }
            })
        })
        await addDocList({},{data_list:doclist_a});
        await putDocList({},{data_list:doclist_p})
        await updateWpData({},{data_list:wplist});
    }
    //不通过
    async reject(){
        const {wk} = this.props
        const {actions:{deleteWorkflow}} = this.props
        await deleteWorkflow({pk:wk.id})
        // let executor = {};
        // let person = getUser();
        // executor.id = person.id;
        // executor.username = person.username;
        // executor.person_name = person.name;
        // executor.person_code = person.code;
        // await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'退回',note:'滚',executor:executor,attachment:null});
    }
    //预览
    handlePreview(index){
        const {actions: {openPreview}} = this.props;
        let f = this.state.dataSource[index].file
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }
    //radio变化
    onChange(e){
        this.setState({opinion:e.target.value})
    }
    cancel() {
    	this.props.closeModal("design_check_visbile",false)
    }
	render() {
        const columns = 
        [{
            title:'序号',
			render:(text,record,index) => {
				return index+1
			}
		}, {
			title: '文档编码',
			dataIndex: 'code'
		}, {
			title: '文档名称',
			dataIndex: 'name'
		}, {
			title:'项目/子项目名称',
            dataIndex:'project',
            render: (text, record, index) => (
                <span>
                    {record.project.name}
                </span>
            ),
		}, {
			title:'单位工程',
            dataIndex:'unit',
            render: (text, record, index) => (
                <span>
                    {record.unit.name}
                </span>
            ),
		}, {
			title:'项目阶段',
            dataIndex:'stage',
		}, {
			title:'提交单位',
            dataIndex:'upunit',
		}, {
			title:'文档类型',
            dataIndex:'filetype',
		}, {
			title:'专业',
            dataIndex:'major',
		}, {
			title:'描述的WBS对象',
            dataIndex:'wbsObject',
		}, {
			title: '描述的设计对象',
			dataIndex: 'designObject'
		}, {
            title:'附件',
			render:(text,record,index) => {
                return (<span>
                        <a onClick={this.handlePreview.bind(this,index)}>预览</a>
                        <span className="ant-divider" />
                        <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                    </span>)
			}
        }]
		return (
            <Modal
			title="检验批信息审批表"
            visible={true}
            width= {1280}
			footer={null}
			maskClosable={false}
			onCancel={this.cancel.bind(this)}
			>
                <div>
                    <h1 style ={{textAlign:'center',marginBottom:20}}>结果审核</h1>
                    <Table style={{ marginTop: '10px', marginBottom:'10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered />
                    <Row>
                        <Col span={2}>
                            <span>审查意见：</span>
                        </Col>
                        <Col span={4}>
                            <RadioGroup onChange={this.onChange.bind(this)} value={this.state.opinion}>
                                <Radio value={1}>通过</Radio>
                                <Radio value={2}>不通过</Radio>
                            </RadioGroup>
                        </Col>
                        <Col span={2} push={14}>
                            <Button type='primary'>
                                导出表格
                            </Button>
                        </Col>
                        <Col span={2} push={14}>
                            <Button type='primary' onClick={this.submit.bind(this)}>
                                确认提交
                            </Button>
                            <Preview />
                        </Col>
                    </Row>
                    {
                        this.state.wk && <WorkflowHistory wk={this.state.wk}/>
                    }
                </div>
            </Modal>
		)
    }
}