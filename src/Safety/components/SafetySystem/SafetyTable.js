import React, { Component } from 'react';
import { Form, Icon, Table, Spin, Tabs, Modal, Row, Col, Select, DatePicker, Button, Input, InputNumber, Progress, message } from 'antd';
import moment from 'moment';
import { FOREST_API } from '../../../_platform/api';
import '../index.less';
import '../../../Datum/components/Datum/index.less'

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class SafetyTable extends Component {
	constructor(props) {
		super(props)
		this.state = {
			workflowTable:[],
			taskVisible:false
		}
	}
	static layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
	};
	componentDidMount() {

	}

	render() {
		const{

		}=this.props
		const {
			workflowTable
		}=this.state
		return (
			<div>
                
                <Button onClick={this.addClick.bind(this)}>新增</Button>
				<Table
                    columns={this.columns}
                    // rowSelection={rowSelection}
                    dataSource={workflowTable} 
                    bordered
                    className='foresttable'
				/>
			</div>
		);
	}
	 // 新增按钮
	 addClick = () => {
        const { actions: { AddVisible } } = this.props;
		AddVisible(true);
        

	}
	// 操作--查看
    clickInfo(record) {
        this.setState({ taskVisible: true ,TotleModaldata:record});
    }
	columns = [
		{
			title: "标段",
			key:'section',
			dataIndex: 'section',
		}, {
			title: "名称",
			dkey:'name',
			dataIndex: 'name',
		}, {
			title: "编号",
			key:'code',
			dataIndex: 'code',
		}, {
			title: "文档类型",
			key:'documentType',
			dataIndex: 'documentType',
		}, {
			title: "提交单位",
			key:'createUnit',
			dataIndex: 'createUnit',
		}, {
			title: "提交人",
			key:'createPerson',
			dataIndex: 'createPerson',
		}, {
			title: "提交时间",
			key:'createTime',
			dataIndex: 'createTime',
		}, {
			title: '流程状态',
			dataIndex: 'status',
			key: 'status',
			width: '10%',
			render:(record,index)=>{
                if(record===1){
                    return '已提交'
                }else if(record===2){
                    return '执行中'
                }else if(record===3){
                    return '已完成'
                }else{
                    return ''
                }
            }
		}, {
			title: "操作",
			render: record => {
				return (
					<span>
						<a onClick={this.clickInfo.bind(this, record, 'VIEW')}>查看</a>
					</span>
				)
			}
		}
	];
}

