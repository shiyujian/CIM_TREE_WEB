import React, { Component } from 'react';
import { Table, Spin, message,Modal,Button,Form,Row,Col,Select,Input,Icon,DatePicker} from 'antd';
import { base, STATIC_DOWNLOAD_API,SOURCE_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';
import { WORKFLOW_CODE } from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';
import SeedingFilter from './SeedingFilter';

const FormItem = Form.Item;
const {RangePicker}=DatePicker;

let indexSelect='';
class SeedingTable extends Component {

	constructor(props){
		super(props);
		this.state={
			visible: false,
		   data:[],
		   indexSelect:'' ,
		   record:{},
		   workflowData:[]
		}
   }
   // state = { 
   // 	visible: false,
   // 	data:[],
   // 	indexSelect:'' 
   // }

   columns = [
	   {
		   title: '单位工程',
		   dataIndex: 'unit',
		   key: 'unit',
	   }, {
		   title: '名称',
		   dataIndex: 'name',
		   key: 'name',
	   },{
		   title: '编号',
		   dataIndex: 'code',
		   key: 'code',
	   }, {
		   title: '文档类型',
		   dataIndex: 'extra_params.style',
		   key: 'extra_params.style',
	   }, {
		   title: '进场日期',
		   dataIndex: 'date',
		   key: 'date',
	   },{
		   title: '施工部位',
		   dataIndex: 'site',
		   key: 'site',
	   }, {
		   title: '提交人',
		   dataIndex: 'submitPerson',
		   key: 'submitPerson'
	   }, {
		   title: '提交时间',
		   dataIndex: 'submitTime',
		   key: 'submitTime'
	   }, {
		   title: '流程状态',
		   dataIndex: 'resourceStyle',
		   key: 'resourceStyle'
	   }, {
		   title: '操作',
		   dataIndex: 'opera',
		   key: 'opera',
		   render: (text,record, index) => {
			   return(
				   <div>
					   <a type="primary" onClick={this.showModal.bind(this,index,record)}>查看</a>
				   </div>
			   )	
		   }
	   }
   ];

   equipmentColumns=[
	   {
		   title: '名称',
		   dataIndex: 'extra_params.equipName',
		   key: 'extra_params.equipName',

	   }, {
		   title: '规格',
		   dataIndex: 'extra_params.equipFormat',
		   key: 'extra_params.equipFormat',
	   },{
		   title: '数量',
		   dataIndex: 'extra_params.equipCount',
		   key: 'extra_params.equipCount',
	   }, {
		   title: '单位',
		   dataIndex: 'extra_params.equipUnit',
		   key: 'extra_params.equipUnit',
	   },{
		   title: '产地',
		   dataIndex: 'extra_params.equipPlace',
		   key: 'extra_params.equipPlace', 
	   }
   ];

   columns1 = [
	   {
	   title: '序号',
	   dataIndex: 'index',
	   key: 'index',
	   width: '20%',
	   }, {
		   title: '文件名称',
		   dataIndex: 'fileName',
		   key: 'fileName',
		   width: '45%',
	   }, {
		   title: '操作',
		   dataIndex: 'operation',
		   key: 'operation',
		   width: '20%',
		   render:(text, record, index)=>{
			   const { Doc = [] } = this.props;
			   return (
				   <div>
					   <a onClick={this.previewFile.bind(this,record)}>预览</a>
					   <a  style={{ marginLeft: 10 }} onClick={this.downloadFile.bind(this,record)}>下载</a>
				   </div>
			   )
		   }
	   }
   ]

   static layoutT = {
	labelCol: {span: 8},
	wrapperCol: {span: 16},
};

	componentDidMount(){
		this.gettaskSchedule()
	}

	// 获取日计划进度流程信息
    gettaskSchedule = async ()=>{
		const { actions: { getWorkflows } } = this.props;
		let reqData={};
		this.props.form.validateFields((err, values) => {
			console.log("苗木资料报批流程", values);
            console.log("err", err);
            
			values.sunit?reqData.subject_unit__contains = values.sunit : '';
			values.sname?reqData.subject_name__contains = values.sname : '';
            values.scode?reqData.subject_code__contains = values.scode : '';
            values.stimedate?reqData.real_start_time_begin = moment(values.stimedate[0]._d).format('YYYY-MM-DD HH:MM:SS') : '';
            values.stimedate?reqData.real_start_time_end = moment(values.stimedate[1]._d).format('YYYY-MM-DD HH:MM:SS') : '';
            values.sstatus?reqData.status = values.sstatus : (values.sstatus === 0? reqData.status = 0 : '');
        })
        
        console.log('reqData',reqData)

        let tmpData = Object.assign({}, reqData);


        let task = await getWorkflows({ code: WORKFLOW_CODE.苗木资料报批流程 },tmpData);
		console.log('task',task)
        let subject = [];
        let totledata = [];
		let arrange = {};
		task.map((item,index)=>{

			let subject = item.workflowactivity.subject[0];
			let creator = item.workflowactivity.creator;
			console.log('subject',subject)
			let data = {
				// index:index+1,
				'id':item.workflowactivity.id,
				'workflow':item,
				'TreatmentData':subject.TreatmentData?JSON.parse(subject.TreatmentData):'',
				'dataSource':subject.dataSource?JSON.parse(subject.dataSource):'',
				'unit':subject.unit?JSON.parse(subject.unit):'',
				'name':subject.name?JSON.parse(subject.name):'',
				'code':subject.code?JSON.parse(subject.code):'',
				'extra_params.style':'',
				'reviewUnit':subject.reviewUnit?JSON.parse(subject.reviewUnit):'',
				'date':subject.date?moment(JSON.parse(subject.date)).format('YYYY-MM-DD'):'',
				'site':subject.site?JSON.parse(subject.site):'',
				'submitOrg':subject.submitOrg?JSON.parse(subject.submitOrg):'',
				'submitPerson':creator.person_name?creator.person_name:(creator.username?creator.username:''),
				'submitTime':moment(item.workflowactivity.creator).format('YYYY-MM-DD'),
				'resourceStyle':item.workflowactivity.status===2?'执行中':'已完成',
			}
			totledata.push(data)
		})
		console.log('totledata',totledata)
        this.setState({
            workflowData:totledata
        })
    }
	render() {
		let {
			  visible,
			  data,
			  record,
			  workflowData
        } = this.state;
		const { 
			Doc = [],
			form: { getFieldDecorator }
		} = this.props;
		
		return (
			<div>
				<SeedingFilter  {...this.props} {...this.state} gettaskSchedule={this.gettaskSchedule.bind(this)}/>
				<Button onClick={this.addClick.bind(this)}>新增</Button>
				<Table 
					// rowSelection={this.rowSelection}
					dataSource={workflowData}
					columns={this.columns}
					bordered />
			{
				this.state.visible==true &&
				<Modal
		          title="查看文档"
		          width={920}
		          visible={this.state.visible}
		          maskClosable={false}
		          onOk={this.handleOk}
		          onCancel={this.handleCancel}
		        >
			        <div>
	                    <Row gutter={24}>
	                        <Col span={24} style={{paddingLeft:'3em'}}>
	                            <Row gutter={15} style={{marginTop:'2em'}} >
	                                <Col span={8}>
	                                    <FormItem   {...SeedingTable.layoutT} label="单位工程:">
										{getFieldDecorator('form2_unit', {
                                            initialValue: `${record.unit?record.unit:''}`,
                                            rules: [{ required: true, message: '请输入单位工程' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                                <Col span={8}>
	                                    <FormItem {...SeedingTable.layoutT} label="名称:">
										{getFieldDecorator('form2_name', {
                                            initialValue: `${record.name?record.name:''}`,
                                            rules: [{ required: true, message: '请输入名称' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                                <Col span={8}>
	                                    <FormItem {...SeedingTable.layoutT} label="编号:">
										{getFieldDecorator('form2_code', {
                                            initialValue: `${record.code?record.code:''}`,
                                            rules: [{ required: true, message: '请输入编号' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                            </Row>
	                            <Row gutter={15}>
	                                <Col span={8}>
	                                    <FormItem  {...SeedingTable.layoutT} label="审批单位:">
										{getFieldDecorator('form2_reviewUnit', {
                                            initialValue: `${record.reviewUnit?record.reviewUnit:''}`,
                                            rules: [{ required: true, message: '请输入审批单位' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                                <Col span={8}>
	                                    <FormItem {...SeedingTable.layoutT} label="进场日期:">
										{getFieldDecorator('form2_date', {
                                            initialValue: `${record.date?record.date:''}`,
                                            rules: [{ required: true, message: '请输入进场日期' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                                <Col span={8}>
	                                    <FormItem {...SeedingTable.layoutT} label="施工部位:">
										{getFieldDecorator('form2_site', {
                                            initialValue: `${record.site?record.site:''}`,
                                            rules: [{ required: true, message: '请输入施工部位' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                            </Row>
	                        </Col>
	                    </Row>
	                    <Row gutter={24}>
	                        <Col span={24}>
								<Table 
								   columns={this.equipmentColumns}
								   dataSource={record.dataSource?record.dataSource:[]}
								   bordered 
								   pagination={true}
								/>	
	                        </Col>
	                    </Row>
	                    <Row gutter={24}>
							<Col span={24} style={{marginTop:'1em'}}>
								<Table  dataSource={record.TreatmentData?record.TreatmentData:[]}
										columns={this.columns1} 
										bordered 
										pagination={true}
								/>
									
							</Col>
	                    </Row>
						<Preview />
					</div>
		        </Modal>
			}	
			</div>
		);
	}

	addClick(){
		const {
            actions: {SeedingAddVisible}
        } = this.props;
        SeedingAddVisible(true);
	}

	showModal = (key,record) => {
		this.setState({
			record:record,
			visible: true,
			indexSelect:key
		}); 
	}
	handleOk = (e) => {
		this.setState({
			visible: false,
		});
	}
	handleCancel = (e) => {
		this.setState({
			visible: false,
		});
	}

	// rowSelection = {
	// 	onChange: (selectedRowKeys, selectedRows) => {
	// 		const { actions: { selectDocuments } } = this.props;
	// 		selectDocuments(selectedRows);
	// 	},
	// };
	
	//下载
	downloadFile(record){
        console.log('TreatmentData',record)
        let link = document.createElement("a");
        if(record && record.download_url){
            link.href = STATIC_DOWNLOAD_API + record.download_url;
            link.setAttribute('download', this);
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }else{
            notification.error({
                message: '文件下载失败',
                duration: 2
            })
            return;
        }
    }

	//文件预览
	previewFile(record, index) {
        const { actions: { openPreview } } = this.props;
    
        console.log('record',record)
        let filed = {};
        if (record && record.file_id) {
            
            filed.misc = "file";
            filed.a_file = `${SOURCE_API}` + record.a_file;
            filed.download_url = `${STATIC_DOWNLOAD_API}` + record.download_url;
            filed.name = record.fileName;
            filed.id = record.file_id;
            let type = record.a_file.split('.')[1];
            if (type == 'xlsx' || type == 'docx' || type == 'xls' || type == 'doc' || type == 'pptx' || type == 'ppt') {
                filed.mime_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }
            if (type == 'pdf') {
                filed.mime_type = "application/pdf";
            }
        }
        openPreview(filed);
    }

	
}
export default Form.create()(SeedingTable)