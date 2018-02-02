import React, { Component } from 'react';
import { Table, Spin, message,Modal,Button,Form,Row,Col,Select,Input,Icon,DatePicker,Popconfirm} from 'antd';
import { base, STATIC_DOWNLOAD_API,SOURCE_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';
import { WORKFLOW_CODE } from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';

const FormItem = Form.Item;
const {RangePicker}=DatePicker;

let indexSelect='';
class ResourceTable extends Component {

	constructor(props){
         super(props);
         this.state={
         	visible: false,
			data:[],
			indexSelect:'' ,
			record:{}
         }
    }
	// state = { 
	// 	visible: false,
	// 	data:[],
	// 	indexSelect:'' 
	// }

	columns1 = [{
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
	}]
	
	static layoutT = {
		labelCol: {span: 8},
		wrapperCol: {span: 16},
	};
	
	componentDidMount(){
		const {
			actions:{
				getWorkflows2
			}
		} = this.props

		let code = {
			code:WORKFLOW_CODE.工程材料报批流程
		}
		getWorkflows2(code)
	}
	render() {
		let {
			  visible,
			  data,
			  record
        } = this.state;
		const { 
			Doc = [],
			form: { getFieldDecorator },
			workflows2 
		} = this.props;
		let dataSource = []
		if(workflows2 && Array.isArray(workflows2) && workflows2.length>0){
			dataSource = this.getTable(workflows2)
		}
		return (
			<div>
				<Table 
					// rowSelection={this.rowSelection}
					dataSource={dataSource}
					columns={this.columns}
					bordered rowKey="code" />
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
			        		<Col>
			        			<div style={{borderBottom: 'solid 1px #999'}}></div>
			        		</Col>
			        	</Row>
	                    <Row gutter={24}>
	                        <Col span={24} style={{paddingLeft:'3em'}}>
	                            <Row gutter={15} style={{marginTop:'2em'}} >
	                                <Col span={8}>
	                                    <FormItem   {...ResourceTable.layoutT} label="单位工程:">
										{getFieldDecorator('form_unit', {
                                            initialValue: `${record.unit?record.unit:''}`,
                                            rules: [{ required: true, message: '请输入单位工程' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                                <Col span={8}>
	                                    <FormItem {...ResourceTable.layoutT} label="名称:">
										{getFieldDecorator('form_name', {
                                            initialValue: `${record.name?record.name:''}`,
                                            rules: [{ required: true, message: '请输入名称' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                                <Col span={8}>
	                                    <FormItem {...ResourceTable.layoutT} label="编号:">
										{getFieldDecorator('form_code', {
                                            initialValue: `${record.code?record.code:''}`,
                                            rules: [{ required: true, message: '请输入编号' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                            </Row>
	                            <Row gutter={15}>
	                                <Col span={8}>
	                                    <FormItem  {...ResourceTable.layoutT} label="审批单位:">
										{getFieldDecorator('form_reviewUnit', {
                                            initialValue: `${record.reviewUnit?record.reviewUnit:''}`,
                                            rules: [{ required: true, message: '请输入审批单位' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                                <Col span={8}>
	                                    <FormItem {...ResourceTable.layoutT} label="进场日期:">
										{getFieldDecorator('form_date', {
                                            initialValue: `${record.date?record.date:''}`,
                                            rules: [{ required: true, message: '请输入进场日期' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                                <Col span={8}>
	                                    <FormItem {...ResourceTable.layoutT} label="施工部位:">
										{getFieldDecorator('form_site', {
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

	getTable(instance){
		let dataSource = []
		instance.map((item)=>{
			let subject = item.subject[0];
			let creator = item.creator;
			console.log('subject',subject)
			let data = {
				'id':item.id,
				'workflow':item,
				'TreatmentData':subject.TreatmentData?JSON.parse(subject.TreatmentData):'',
				'dataSource':subject.dataSource?JSON.parse(subject.dataSource):'',
				'unit':subject.unit?JSON.parse(subject.unit):'',
				'name':subject.name?JSON.parse(subject.name):'',
				'code':subject.code?JSON.parse(subject.code):'',
				'extra_params.style':'',
				'reviewUnit':subject.reviewUnit?JSON.parse(subject.reviewUnit):'',
				'date':subject.date?JSON.parse(subject.date):'',
				'site':subject.site?JSON.parse(subject.site):'',
				'submitPerson':creator.person_name?creator.person_name:(creator.username?creator.username:''),
				'submitTime':moment(item.real_start_time).format('YYYY-MM-DD'),
				'resourceStyle':item.status===2?'执行中':'已完成',
			}
			dataSource.push(data)
		})
		console.log('dataSource',dataSource)
		return dataSource
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


	columns = [
		{
			title: '单位工程',
			dataIndex: 'unit',
			key: 'unit',
			// sorter: (a, b) => a.name.length - b.name.length
		}, {
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			// sorter: (a, b) => a.code.length - b.code.length
		},{
			title: '编号',
			dataIndex: 'code',
			key: 'code',
			// sorter: (a, b) => a.code.length - b.code.length
		}, {
			title: '文档类型',
			dataIndex: 'extra_params.style',
			key: 'extra_params.style',
			// sorter: (a, b) => a.extra_params.company.length - b.extra_params.company.length
		}, {
			title: '施工部位',
			dataIndex: 'reviewUnit',
			key: 'reviewUnit',
			// sorter: (a, b) => moment(a.extra_params.time).unix() - moment(b.extra_params.time).unix()
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
export default Form.create()(ResourceTable)