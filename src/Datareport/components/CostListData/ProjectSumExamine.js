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
export default class ProjectSumExamine extends Component {
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
        this.setState({dataSource,wk})
   }
   //提交
    async submit(){
        // if(this.state.opinion === 1){
        //     await this.passon();
        // }else{
        //     await this.reject();
        // }
        this.props.closeModal("cost_pro_ck_visible",false)
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
        // dataSource.map((o) => {
        //     //创建文档对象
        //     let doc = o.related_documents.find(x => {
        //         x.rel_type === 'many_jyp_rel'
        //     })
        //     debugger
        //     if(doc){
        //         doclist_p.push({
        //             code:doc.code,
        //             extra_params:{
        //                 ...o
        //             }
        //         })
        //     }else{
        //         doclist_a.push({
        //             code:`rel_doc_${o.code}`,
        //             name:`rel_doc_${o.pk}`,
        //             obj_type:"C_DOC",
        //             status:"A",
        //             version:"A",
        //             "basic_params": {
        //             },
        //             workpackages:[{
        //                 code:o.code,
        //                 obj_type:o.obj_type,
        //                 pk:o.pk,
        //                 rel_type:"many_jyp_rel"
        //             }],
        //             extra_params:{
        //                 ...o
        //             }
        //         })
        //     }
        //     //施工包批量
        //     wplist.push({
        //         code:o.code,
        //         extra_params:{
        //             rate:o.rate
        //         }
        //     })
        // })
      
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
				width = {1280}
				visible = {true}
                onCancel = {this.cancel.bind(this)}
                footer = {null}
			>
				<Row style={{margin: '20px 0', textAlign: 'center'}}>
					<h2>结果审核</h2>
				</Row>
				<Row>
					<Table
						bordered
						className = 'foresttable'
                        columns={this.columns}
                        dataSource={this.state.dataSource}
					/>
				</Row>
				<Row style={{margin: '20px 0'}}>
					<Col span={2}>
						<span>审查意见：</span>
					</Col>
					<Col span={4}>
						<RadioGroup onChange={this.onChange} value={this.state.value}>
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
			    <Row style={{marginBottom: '10px'}}>
			    	<div>审批流程</div>
			    </Row>
			    <Row>
			    	<Col span={10}>
			    		<div style={{padding: '20px 0 0 10px', width: '300px', height: '200px', border: '1px solid #000'}}>
			    			<div>执行人：</div>
			    			<div>执行时间：</div>
			    			<div>执行意见：</div>
			    			<div style={{marginTop: '40px'}}>电子签章：</div>
			    		</div>
			    		<div style={{width: '300px', textAlign: 'center', fontSize: '16px'}}>数据上传</div>
			    	</Col>
			    	<Col span={10}>
			    		<div style={{padding: '20px 0 0 10px', width: '300px', height: '200px', border: '1px solid #000'}}>
			    			<div>执行人：</div>
			    			<div>执行时间：</div>
			    			<div>执行意见：</div>
			    			<div style={{marginTop: '40px'}}>电子签章：</div>
			    		</div>
			    		<div style={{width: '300px', textAlign: 'center', fontSize: '16px'}}>数据上传审核</div>
			    	</Col>
			    </Row>
			</Modal>
		)
	}

	
columns = 
    [{
        title:'序号',
        width:"5%",
        render:(text,record,index) => {
            return index+1
        }
    },{
        title:'项目/子项目',
        dataIndex:'subproject',
        width:"13%",
    
    },{
        title: '单位工程',
        dataIndex: 'unit_engineeing',
        
      },{
        title: '项目编码',
        dataIndex: 'projectcoding',
      },{
        title: '项目名称',
        dataIndex: 'projectname',
      },{
        title: '计量单位',
        dataIndex: 'company',
      },{
        title: '数量',
        dataIndex: 'number',
      },{
        title: '单价',
        dataIndex: 'total',
      }]

	cancel() {
		const {
			actions: {clearCheckField}
		} = this.props;
		clearCheckField();
	}
}
