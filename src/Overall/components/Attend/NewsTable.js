import React, { Component } from 'react';
import { Table, Tabs, Button, Row, Col, Modal, message, Popconfirm, Form, Input, DatePicker, Icon, Select } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from '../../../_platform/auth';
import { base, SOURCE_API } from '../../../_platform/api';
// import { Icon } from './C:/Users/ecidi/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/react-fa';
import E from 'wangeditor'
import '../../../Datum/components/Datum/index.less'


let editor;
moment.locale('zh-cn');

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const user_id = getUser().id;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const data = [{
	key: '1',
	data: '2017-11-20',
	address: '苗圃',
	personnel: "张某某"
}];

const columns = [{
	title: '日期',
	dataIndex: 'data',
	key: 'data',
	render: text => <a href="#">{text}</a>,
}, {
	title: '标段',
	dataIndex: 'section',
	key: 'section',
}, {
	title: '工种',
	dataIndex: 'address',
	key: 'address',
}, {
	title: '人员',
	dataIndex: 'personnel',
	key: 'personnel',
}, {
	title: '状态',
	key: 'action',
	render: (text, record) => (
		<span>
			<a href="#">进场</a>
		</span>
	),
}];
class NewsTable extends Component {
	render() {
		const rowSelection = {
			// selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return (
			<Row>
				<Table
					columns={columns}
					dataSource={data}
					className="foresttables"
					bordered
					rowSelection={rowSelection}
				/>
				{/* <Modal
					title="新闻预览"
					width="800px"
					visible={this.state.visible}
					onOk={this.handleCancel.bind(this)}
					onCancel={this.handleCancel.bind(this)}
					footer={null}>
					<div style={{ maxHeight: '800px', overflow: 'auto' }}
						dangerouslySetInnerHTML={{ __html: this.state.container }} />
				</Modal> */}

			</Row>
		);
	}


}
export default Form.create()(NewsTable)