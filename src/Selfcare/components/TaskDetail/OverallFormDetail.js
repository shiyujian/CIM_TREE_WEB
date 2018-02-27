import React, { Component } from 'react';
import { Table, Spin, message,Modal,Button,Form,Row,Col,Select,Input,Icon,DatePicker,Popconfirm,Card} from 'antd';
import { base, STATIC_DOWNLOAD_API,SOURCE_API,WORKFLOW_CODE } from '../../../_platform/api';
import moment from 'moment';
import Preview from '../../../_platform/components/layout/Preview';

const FormItem = Form.Item;
const {RangePicker}=DatePicker;

let indexSelect='';
class OverallFormDetail extends Component {

	constructor(props){
         super(props);
         this.state={
         	visible: false,
			data:[],
			indexSelect:'' ,
			record:{}
         }
    }

    columns1 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: '10%',
            render: (text, record, index) => {
                return index + 1
            }
        }, {
            title: '文件名称',
            dataIndex: 'fileName',
            key: 'fileName',
            width: '35%',
        }, {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '30%',
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
            render: (text, record, index) => {
                return <div>
                   <a onClick={this.previewFile.bind(this,record)}>预览</a>
                   <span className="ant-divider" />
					<a  style={{ marginLeft: 10 }} onClick={this.downloadFile.bind(this,record)}>下载</a>
                </div>
            }
        }
    ]

	
	static layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 20},
    };

	
	render() {
		const { 
			
			form: { getFieldDecorator },
			platform: { task = {} } = {} 
        } = this.props;
		let record = {}
		if(task && task.subject){
			record = this.getTable(task)
		}
		return (
			<Card title={'流程详情'}>
				<Row gutter={24}>
					<Col span={24} >
						<Row gutter={15} >
							<Col span={8}>
								<FormItem   {...OverallFormDetail.layout} label="单位工程:">
								{getFieldDecorator('formunit', {
									initialValue: `${record.unit ? record.unit : '暂无单位工程'}`,
									rules: [{ required: false, message: '请输入单位工程' }]
								})(<Input readOnly />)}
								</FormItem>
							</Col>
                            <Col span={8}>
								<FormItem   {...OverallFormDetail.layout} label="名称:">
								{getFieldDecorator('formname', {
									initialValue: `${record.name ? record.name : '暂无名称'}`,
									rules: [{ required: false, message: '请输入名称' }]
								})(<Input readOnly />)}
								</FormItem>
							</Col>
                            <Col span={8}>
								<FormItem {...OverallFormDetail.layout} label="编号:">
								{getFieldDecorator('formnumbercode', {
                                    initialValue: `${record.numbercode ? record.numbercode : '暂无编号'}`,
                                    rules: [
                                        { required: false, message: '请输入编号' }
                                    ]
                                })(<Input readOnly />)}
								</FormItem>
							</Col>
							
						</Row>
						<Row gutter={15}>
                            <Col span={8}>
								<FormItem {...OverallFormDetail.layout} label="文档类型:">
								{getFieldDecorator('formdocument', {
                                    initialValue: `${record.document? record.document : '暂无文档类型'}`,
                                    rules: [
                                        { required: false, message: '请输入文档类型' }
                                    ]
                                })(<Input readOnly />)}
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem  {...OverallFormDetail.layout} label="审批单位:">
								{getFieldDecorator('formsuperunit', {
                                    initialValue: `${record.superunit ?record.superunit: '暂无审批单位'}`,
                                    rules: [
                                        { required: false, message: '请输入审批单位' }
                                    ]
                                })(<Input readOnly />)}
								</FormItem>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row gutter={24}>
					<Col span={24}>
                        <Table
                            columns={this.columns1}
                            pagination={true}
                            dataSource={record.TreatmentData}
                        />
					</Col>
				</Row>
				<Preview />
		       
			</Card>
		);
	}

	getTable(instance){
        let subject = instance.subject[0]
        let postData = subject.postData?JSON.parse(subject.postData):''
        let record = {
            id:instance.id,
            unit: subject.unit?JSON.parse(subject.unit):'',
            name: subject.name?JSON.parse(subject.name):'',
            numbercode:subject.numbercode?JSON.parse(subject.numbercode):'',
            document:subject.document?JSON.parse(subject.document):'',
            superunit:subject.dataReview?JSON.parse(subject.dataReview).org:'',
            TreatmentData:subject.TreatmentData?JSON.parse(subject.TreatmentData):'',
        }
		return record
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
	
}
export default Form.create()(OverallFormDetail)