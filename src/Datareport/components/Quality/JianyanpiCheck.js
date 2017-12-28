import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/quality';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory'
import Preview from '_platform/components/layout/Preview';
import {getUser} from '_platform/auth';
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select
@connect(
	state => {
		const { platform} = state;
		return { platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions,...platformActions}, dispatch)
	})
)
export default class JianyanpiCheck extends Component {

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
        //  const {actions:{ getWorkflow }} = this.props
        //  getWorkflow({pk:wk.id}).then(rst => {
        //      let dataSource = JSON.parse(rst.subject[0].data)
        //      this.setState({dataSource,wk:rst})
        //  })
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
        this.props.closeModal("dr_qua_jyp_visible",false)
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
                    },
                    workpackages:[{
                        code:o.code,
                        obj_type:o.obj_type,
                        pk:o.pk,
                        rel_type:"many_jyp_rel"
                    }],
                    "basic_params": {
                        "files": [
                            o.file
                        ]
                    },
                })
            }else{
                doclist_a.push({
                    code:`rel_doc_jyp_${o.code}`,
                    name:`${o.name}附件`,
                    obj_type:"C_DOC",
                    status:"A",
                    version:"A",
                    "basic_params": {
                        "files": [
                            o.file
                        ]
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
	render() {
        const columns = 
        [{
            title:'序号',
            width:"5%",
			render:(text,record,index) => {
				return index+1
			}
		},{
			title:'项目/子项目',
            dataIndex:'project',
            width:"13%",
            render: (text, record, index) => (
                <span>
                    {record.project.name}
                </span>
            ),
		},{
			title:'单位工程',
            dataIndex:'unit',
            width:"13%",
            render: (text, record, index) => (
                <span>
                    {record.unit.name}
                </span>
            ),
		},{
			title:'WBS编码',
            dataIndex:'code',
            width:"13%",
		},{
			title:'名称',
            dataIndex:'name',
            width:"13%",
		},{
			title:'检验合格率',
            dataIndex:'rate',
            width:"8%",
            render: (text, record, index) => (
                <span>
                    {(parseFloat(record.rate)*100).toFixed(1) + '%'} 
                </span>
            ),
		},{
			title:'质量等级',
            dataIndex:'level',
            width:"12%",
		},{
			title:'施工单位',
            dataIndex:'construct_unit',
            width:"12%",
            render: (text, record, index) => (
                <span>
                    {record.construct_unit ? record.construct_unit.name : "暂无"}
                </span>
            ),
		}, {
            title:'附件',
            width:"11%",
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
			maskClosable={true}>
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
