import React, { Component } from 'react';
import { Table, Spin, message,Modal,Button,Form,Row,Col,Select,Input,Icon,DatePicker,Popconfirm,Card} from 'antd';
import { base, STATIC_DOWNLOAD_API,SOURCE_API,WORKFLOW_CODE } from '../../../_platform/api';
import moment from 'moment';
import Preview from '../../../_platform/components/layout/Preview';

const FormItem = Form.Item;
const {RangePicker}=DatePicker;

class OverallResourceDetail extends Component {

	constructor(props){
         super(props);
         this.state={
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

	equipmentColumns=[
        {
            title: '名称',
            dataIndex: 'equipName',
            key: 'equipName',

        }, {
            title: '规格',
            dataIndex: 'equipFormat',
            key: 'equipFormat',
        },{
            title: '数量',
            dataIndex: 'equipCount',
            key: 'equipCount',
        }, {
            title: '单位',
            dataIndex: 'equipUnit',
            key: 'equipUnit',
        },{
            title: '产地',
            dataIndex: 'equipPlace',
            key: 'equipPlace', 
        }
    ];

	
	static layout = {
        labelCol: {span: 6},
        wrapperCol: {span: 18},
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
								<FormItem   {...OverallResourceDetail.layout} label="标段:">
								{getFieldDecorator('sectionName', {
									initialValue: `${record.sectionName?record.sectionName:''}`,
									rules: [{ required: true, message: '请输入标段' }]
								})(<Input readOnly />)}
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...OverallResourceDetail.layout} label="名称:">
								{getFieldDecorator('name', {
									initialValue: `${record.name?record.name:''}`,
									rules: [{ required: true, message: '请输入名称' }]
								})(<Input readOnly />)}
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...OverallResourceDetail.layout} label="编号:">
								{getFieldDecorator('code', {
									initialValue: `${record.code?record.code:''}`,
									rules: [{ required: true, message: '请输入编号' }]
								})(<Input readOnly />)}
								</FormItem>
							</Col>
						</Row>
						<Row gutter={15}>
							<Col span={8}>
								<FormItem {...OverallResourceDetail.layout} label="进场日期:">
								{getFieldDecorator('date', {
									initialValue: `${record.date?record.date:''}`,
									rules: [{ required: true, message: '请输入进场日期' }]
								})(<Input readOnly />)}
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...OverallResourceDetail.layout} label="施工部位:">
								{getFieldDecorator('site', {
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
		       
			</Card>
		);
	}

	getTable(instance){
		let subject = instance.subject[0]
        let record = {
            'id':instance.id,
			'TreatmentData':subject.TreatmentData?JSON.parse(subject.TreatmentData):'',
			'dataSource':subject.dataSource?JSON.parse(subject.dataSource):'',
			'section':subject.section?JSON.parse(subject.section):'',
            'sectionName': subject.sectionName?JSON.parse(subject.sectionName):'',
			'name':subject.name?JSON.parse(subject.name):'',
			'code':subject.code?JSON.parse(subject.code):'',
			'date':subject.date?moment(JSON.parse(subject.date)).format('YYYY-MM-DD'):'',
			'site':subject.site?JSON.parse(subject.site):'',
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
export default Form.create()(OverallResourceDetail)