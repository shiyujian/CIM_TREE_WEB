import React, { Component } from 'react';
import { Table, Spin, message,Modal,Button,Form,Row,Col,Select,Input,Icon,Card} from 'antd';
import moment from 'moment';
import { WORKFLOW_CODE,SOURCE_API,base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';

const FormItem = Form.Item;

let indexSelect='';
class OverallGeneralDetail extends Component {

	constructor(props){
         super(props);
         this.state={
         	visible: false,
			data:[],
			indexSelect:'',
			record:{}
         }
    }
	

	columns1 = [
        {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: '20%',
        render:(text, record, index)=>{
            return(
                <span>{record.index+1}</span>
            )
        }
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
                        <a onClick={this.previewFile.bind(this,record,index)}>预览</a>
                        <a  style={{ marginLeft: 10 }} onClick={this.downloadFile.bind(this,record)}>下载</a>
                    </div>
                )
            }
        }
    ]

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
    
    
    static layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 20},
    };

	render() {
		const { 
			platform: { task = {} } = {},
			form: { getFieldDecorator }
		 } = this.props;
		let record = {}
		if(task && task.subject){
			record = this.getTable(task)
        }

        console.log('sssssssssssssssssssssssssssssss')
		return (
			<Card title={'流程详情'}>
                <Row gutter={24}>
                    <Col span={24} >
                        <Row gutter={15}  >
                            <Col span={12}>
                                <FormItem   {...OverallGeneralDetail.layout} label="单位工程:">
                                {getFieldDecorator('form1_unit', {
                                    initialValue: `${record.unit?record.unit:''}`,
                                    rules: [{ required: true, message: '请输入单位工程' }]
                                })(<Input readOnly />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...OverallGeneralDetail.layout} label="编号:">
                                {getFieldDecorator('form1_code', {
                                    initialValue: `${record.code?record.code:''}`,
                                    rules: [{ required: true, message: '请输入编号' }]
                                })(<Input readOnly />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={15}>
                            <Col span={12}>
                                <FormItem  {...OverallGeneralDetail.layout} label="审批单位:">
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
                
			</Card>

		);
	}

	getTable(instance){
        let subject = instance.subject[0]
        let record = {
            'id':instance.id,
            'TreatmentData':subject.TreatmentData?JSON.parse(subject.TreatmentData):'',
            'dataSource':subject.dataSource?JSON.parse(subject.dataSource):'',
            'unit':subject.unit?JSON.parse(subject.unit):'',
            'code':subject.code?JSON.parse(subject.code):'',
            'reviewUnit':subject.reviewUnit?JSON.parse(subject.reviewUnit):'',
            
        }
        console.log('record',record)
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

export default Form.create()(OverallGeneralDetail)