import React, { Component } from 'react';
import { Table, Spin, message,Modal,Button,Form,Row,Col,Select,Input,Icon,DatePicker,Popconfirm,Card} from 'antd';
import { base, STATIC_DOWNLOAD_API,SOURCE_API,WORKFLOW_CODE } from '../../../_platform/api';
import moment from 'moment';
import Preview from '../../../_platform/components/layout/Preview';

const FormItem = Form.Item;
const {RangePicker}=DatePicker;

let indexSelect='';
class ScheduleStageDetail extends Component {

	constructor(props){
         super(props);
         this.state={
         	visible: false,
			data:[],
			indexSelect:'' ,
			record:{}
         }
    }

	
	static layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 20},
    };

    columns1 = [{
		title: '序号',
		dataIndex: 'key',
		key: 'key',
		width: '10%',
	}, {
		title: '项目',
		dataIndex: 'project',
		key: 'project',
	}, {
		title: '单位',
		dataIndex: 'units',
		key: 'units',
	}, {
		title: '数量',
		dataIndex: 'number',
		key: 'number',
	},];

	
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
							<Col span={12}>
								<FormItem   {...ScheduleStageDetail.layout} label="标段:">
								{getFieldDecorator('stagesection', {
									initialValue: `${record.sectionName ? record.sectionName : '暂无标段'}`,
									rules: [{ required: false, message: '请输入标段' }]
								})(<Input readOnly />)}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem {...ScheduleStageDetail.layout} label="编号:">
								{getFieldDecorator('stegenumbercode', {
                                    initialValue: `${record.numbercode ? record.numbercode : '暂无编号'}`,
                                    rules: [
                                        { required: false, message: '请输入编号' }
                                    ]
                                })(<Input readOnly />)}
								</FormItem>
							</Col>
							
						</Row>
						<Row gutter={15}>
							<Col span={12}>
								<FormItem {...ScheduleStageDetail.layout} label="文档类型:">
								{getFieldDecorator('stagedocument', {
                                    initialValue: `${record.stagedocument? record.stagedocument : '暂无文档类型'}`,
                                    rules: [
                                        { required: false, message: '请输入文档类型' }
                                    ]
                                })(<Input readOnly />)}
								</FormItem>
							</Col>
                            <Col span={12}>
								<FormItem {...ScheduleStageDetail.layout} label="日期:">
								{getFieldDecorator('stagetimedate', {
                                    initialValue: `${record.timedate? record.timedate : '暂无日期'}`,
                                    rules: [
                                        { required: false, message: '请输入日期' }
                                    ]
                                })(<Input readOnly />)}
								</FormItem>
							</Col>
							{/* <Col span={8}>
								<FormItem  {...ScheduleStageDetail.layout} label="监理单位:">
								{getFieldDecorator('stagesuperunit', {
                                    initialValue: `${record.superunit ?record.superunit: '暂无监理单位'}`,
                                    rules: [
                                        { required: false, message: '请输入监理单位' }
                                    ]
                                })(<Input readOnly />)}
								</FormItem>
							</Col> */}
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
            'id':instance.id,
			'TreatmentData':subject.treedataSource?JSON.parse(subject.treedataSource):'',
			'section':subject.section?JSON.parse(subject.section):'',
			'sectionName': subject.sectionName?JSON.parse(subject.sectionName):'',
            'numbercode':subject.numbercode?JSON.parse(subject.numbercode):'',
            'stagedocument':subject.stagedocument?JSON.parse(subject.stagedocument):'',
			'timedate':subject.timedate?JSON.parse(subject.timedate):'',
			// 'superunit':subject.superunit?JSON.parse(subject.superunit):''
        }
		return record
	}

	
}
export default Form.create()(ScheduleStageDetail)