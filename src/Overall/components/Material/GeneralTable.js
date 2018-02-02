import React, { Component } from 'react';
import { Table, Spin, message,Modal,Button,Form,Row,Col,Select,Input,Icon} from 'antd';
import { base, STATIC_DOWNLOAD_API,SOURCE_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';
import Preview from '../../../_platform/components/layout/Preview';
import { WORKFLOW_CODE } from '../../../_platform/api';

const FormItem = Form.Item;

let indexSelect='';
class GeneralTable extends Component {

	constructor(props){
         super(props);
         this.state={
         	visible: false,
			data:[],
			indexSelect:'',
			record:{}
         }
    }
	

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
	
	componentDidMount(){
		const {
			actions:{
				getWorkflows1
			}
		} = this.props

		let code = {
			code:WORKFLOW_CODE.机械设备报批流程
		}
		getWorkflows1(code)
	}
	render() {
		let {
			  visible,
			  data,
			  record
        } = this.state;
		const { 
			Doc = [],
			docs = [],
			workflows1,
			form: { getFieldDecorator }
		 } = this.props;
		let dataSource = []
		if(workflows1 && Array.isArray(workflows1) && workflows1.length>0){
			dataSource = this.getTable(workflows1)
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
			        		<Col>
			        			<div style={{borderBottom: 'solid 1px #999'}}></div>
			        		</Col>
			        	</Row>
	                    <Row gutter={24}>
	                        <Col span={24} style={{paddingLeft:'3em'}}>
	                            <Row gutter={15} style={{marginTop:'2em'}} >
	                                <Col span={10}>
	                                    <FormItem   {...GeneralTable.layoutT} label="单位工程:">
										{getFieldDecorator('form1_unit', {
                                            initialValue: `${record.unit?record.unit:''}`,
                                            rules: [{ required: true, message: '请输入单位工程' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                                <Col span={10}>
	                                    <FormItem {...GeneralTable.layoutT} label="编号:">
										{getFieldDecorator('form1_code', {
                                            initialValue: `${record.code?record.code:''}`,
                                            rules: [{ required: true, message: '请输入编号' }]
                                        })(<Input readOnly />)}
	                                    </FormItem>
	                                </Col>
	                            </Row>
	                            <Row gutter={15}>
	                                <Col span={20}>
	                                    <FormItem  {...GeneralTable.layout} label="审批单位:">
										{getFieldDecorator('form1_reviewUnit', {
                                            initialValue: `${record.reviewUnit?record.reviewUnit:''}`,
                                            rules: [{ required: true, message: '请输入审批单位' }]
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

	// rowSelection = {
	// 	onChange: (selectedRowKeys, selectedRows) => {
	// 		const { actions: { selectDocuments } } = this.props;
	// 		selectDocuments(selectedRows);
	// 	},
	// };
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
				'code':subject.code?JSON.parse(subject.code):'',
				'extra_params.style':'',
				'reviewUnit':subject.reviewUnit?JSON.parse(subject.reviewUnit):'',
				'submitPerson':creator.person_name?creator.person_name:(creator.username?creator.username:''),
				'submitTime':moment(item.real_start_time).format('YYYY-MM-DD'),
				'flowStyle':item.status===2?'执行中':'已完成',
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
	columns = [
		{
			title: '单位工程',
			dataIndex: 'unit',
			key: 'unit',
			// sorter: (a, b) => a.name.length - b.name.length
		}, {
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
			title: '提交单位',
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
			dataIndex: 'flowStyle',
			key: 'flowStyle'
		}, 	{
			title: '操作',
			render: (text,record, index) => {
				return(
					<div>
						<a type="primary" onClick={this.showModal.bind(this,index,record)}>查看</a>
						{/*<a style={{ marginLeft: 10 }} type="primary" onClick={this.download.bind(this, index)}>下载</a>
						<a style={{ marginLeft: 10 }} onClick={this.update.bind(this, record)}>查看流程卡</a>*/
						}
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