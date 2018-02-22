import React, { Component } from 'react';
import { Table, Spin, message,Modal,Button,Form,Row,Col,Select,Input,Icon} from 'antd';
import { base, STATIC_DOWNLOAD_API,SOURCE_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';
import Preview from '../../../_platform/components/layout/Preview';
import { WORKFLOW_CODE } from '../../../_platform/api';
import GeneralFilter from './GeneralFilter';

const FormItem = Form.Item;

let indexSelect='';
class GeneralTable extends Component {

	constructor(props){
         super(props);
         this.state={
         	visible: false,
			data:[],
			indexSelect:'',
			record:{},
			workflowData:[]
         }
	}
	
	columns = [
		{
			title: '单位工程',
			dataIndex: 'unit',
			key: 'unit',
		}, {
			title: '编号',
			dataIndex: 'code',
			key: 'code',
		}, {
			title: '文档类型',
			dataIndex: 'extra_params.style',
			key: 'extra_params.style',
		}, {
			title: '提交单位',
			dataIndex: 'submitOrg',
			key: 'submitOrg',
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
			dataIndex: 'flowStyle',
			key: 'flowStyle'
		}, 	{
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
            title: '设备名称',
            dataIndex: 'extra_params.equipName',
            key: 'extra_params.equipName',

        }, {
            title: '规格型号',
            dataIndex: 'extra_params.equipNumber',
            key: 'extra_params.equipNumber',
        }, {
            title: '数量',
            dataIndex: 'extra_params.equipCount',
            key: 'extra_params.equipCount',
        }, {
            title: '进场日期',
            dataIndex: 'extra_params.equipTime',
            key: 'extra_params.equipTime',
        }, {
            title: '技术状况',
            dataIndex: 'extra_params.equipMoment',
            key: 'extra_params.equipMoment',
        },{
            title: '备注',
            dataIndex: 'extra_params.equipRemark',
            key: 'extra_params.equipRemark',
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
	
	componentDidMount(){
		this.gettaskSchedule()
	}

	// 获取日计划进度流程信息
    gettaskSchedule = async ()=>{
		const { actions: { getWorkflows } } = this.props;
		let reqData={};
		this.props.form.validateFields((err, values) => {
			console.log("机械设备报批流程", values);
            console.log("err", err);
            
            values.sunit?reqData.subject_unit__contains = values.sunit : '';
            values.scode?reqData.subject_code__contains = values.scode : '';
            values.stimedate?reqData.real_start_time_begin = moment(values.stimedate[0]._d).format('YYYY-MM-DD HH:MM:SS') : '';
            values.stimedate?reqData.real_start_time_end = moment(values.stimedate[1]._d).format('YYYY-MM-DD HH:MM:SS') : '';
            values.sstatus?reqData.status = values.sstatus : (values.sstatus === 0? reqData.status = 0 : '');
        })
        
        console.log('reqData',reqData)

        let tmpData = Object.assign({}, reqData);


        let task = await getWorkflows({ code: WORKFLOW_CODE.机械设备报批流程 },tmpData);
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
				id:item.workflowactivity.id,
				'workflow':item,
				'TreatmentData':subject.TreatmentData?JSON.parse(subject.TreatmentData):'',
				'dataSource':subject.dataSource?JSON.parse(subject.dataSource):'',
				'unit':subject.unit?JSON.parse(subject.unit):'',
				'code':subject.code?JSON.parse(subject.code):'',
				'extra_params.style':'',
				'submitOrg':subject.submitOrg?JSON.parse(subject.submitOrg):'',
				'submitPerson':creator.person_name?creator.person_name:(creator.username?creator.username:''),
				'submitTime':moment(item.workflowactivity.creator).format('YYYY-MM-DD'),
				'flowStyle':item.workflowactivity.status===2?'执行中':'已完成',
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
			docs = [],
			form: { getFieldDecorator }
		 } = this.props;
		
		return (
			<div>
				<GeneralFilter {...this.props} {...this.state} gettaskSchedule={this.gettaskSchedule.bind(this)}/>
				<Table
					// rowSelection={this.rowSelection}
					dataSource={workflowData}
					columns={this.columns}
					bordered 
					Rowkey={'code'}
				/>
			{
				this.state.visible==true &&
				<Modal
		          title="查看流程"
		          width={920}
		          // footer={null}
		          visible={this.state.visible}
		          maskClosable={false}
		          onOk={this.handleOk}
		          onCancel={this.handleCancel}
		        >
			        <div>
	                    <Row gutter={24}>
	                        <Col span={24} style={{paddingLeft:'3em'}}>
	                            <Row gutter={15} style={{marginTop:'2em'}} >
	                                <Col span={12}>
	                                    <FormItem   {...GeneralTable.layoutT} label="单位工程:">
										{getFieldDecorator('form1_unit', {
                                            initialValue: `${record.unit?record.unit:''}`,
                                            rules: [{ required: true, message: '请输入单位工程' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                                <Col span={12}>
	                                    <FormItem {...GeneralTable.layoutT} label="编号:">
										{getFieldDecorator('form1_code', {
                                            initialValue: `${record.code?record.code:''}`,
                                            rules: [{ required: true, message: '请输入编号' }]
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

	// rowSelection = {
	// 	onChange: (selectedRowKeys, selectedRows) => {
	// 		const { actions: { selectDocuments } } = this.props;
	// 		selectDocuments(selectedRows);
	// 	},
	// };


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

	

	static layoutT = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    static layout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
    };
}

export default Form.create()(GeneralTable)