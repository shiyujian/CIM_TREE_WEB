import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/quality';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory'
import Preview from '../../../_platform/components/layout/Preview';
import {getUser} from '_platform/auth';
import '../index.less'; 

const RadioGroup = Radio.Group;
const { TextArea } = Input;
@connect(
	state => {
		const { platform} = state;
		return { platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions,...platformActions}, dispatch)
	})
)
export default class Check extends Component {
	constructor(props) {
		super(props);
		this.state = {
			wk:null,
            dataSource:[],
            opinion:1,//1表示通过 2表示不通过
		}
	}

	async componentDidMount(){
        const {wk} = this.props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({dataSource,wk})
    }

    componentWillReceiveProps(props){
        const {wk} = props
        let dataSource = JSON.parse(wk.subject[0].data)
        console.log('dataSource', dataSource)
        this.setState({dataSource,wk})
   }
   //提交
    async submit(){
        if(this.state.opinion === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        this.props.closeModal("modal_check_visbile",false)
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
                x.rel_type === 'many_jyp_rel'
            })
            debugger
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
                    rate:o.rate
                }
            })
        })
        debugger
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
		return(
			<Modal
				title="模型信息审批表"
				width = {1280}
				visible = {true}
				footer={null}
				maskClosable={false}>
			>
				<Row style={{margin: '20px 0', textAlign: 'center'}}>
					<h2>结果审核</h2>
				</Row>
				<Row>
					<Table
						bordered
						className = 'foresttable'
						columns={this.columns}
					/>
				</Row>
				<Row style={{margin: '20px 0'}}>
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
				    </Col>
			    </Row>
			    <Row style={{margin: '20px 0'}}>
				    <Col>
				    	<TextArea rows={2} />
				    </Col>
			    </Row>
			    {
                    this.state.wk && <WorkflowHistory wk={this.state.wk}/>
                }
			</Modal>
		)
	}

	columns = [{
			title: '序号',
			render:(text,record,index) => {
				return index+1
			}
		}, {
			title: '编码',
			dataIndex: 'value'
		}, {
			title: '项目/子项目名称',
			dataIndex: 'alias'
		}, {
			title: '单位工程',
			dataIndex: 'description1'
		}, {
			title: '模型名称',
			dataIndex: 'description2'
		}, {
			title: '提交单位',
			dataIndex: 'description4'
		}, {
			title: '模型描述',
			dataIndex: 'description5'
		}, {
			title: '模型类型',
			dataIndex: 'description6'
		}, {
			title: 'fdb模型',
			dataIndex: 'description7'
		}, {
			title: 'tdbx模型',
			dataIndex: 'description8'
		}, {
			title: '属性表',
			dataIndex: 'description9'
		}, {
			title: '上报时间',
			dataIndex: 'description10'
		}, {
			title: '上报人',
			dataIndex: 'description11'
		}];
}
