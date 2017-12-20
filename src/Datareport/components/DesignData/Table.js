import React, { Component } from 'react';
import { Button, Table, Icon, Popconfirm, message, Modal, Row, Input } from 'antd';
import Card from '_platform/components/panels/Card';
const Search = Input.Search
export default class DesignTable extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedRowKeys: [],
		}

	}
	onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
	}
	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};

		const columns = [{
			title: '序号',
			dataIndex: 'index',
		}, {
			title: '文档编码',
			dataIndex: 'value'
		}, {
			title: '文档名称',
			dataIndex: 'alias'
		}, {
			title: '项目/子项目名称',
			dataIndex: 'description'
		}, {
			title: '单位工程',
			dataIndex: 'description1'
		}, {
			title: '项目阶段',
			dataIndex: 'description2'
		}, {
			title: '提交单位',
			dataIndex: 'description3'
		}, {
			title: '文档类型',
			dataIndex: 'description4'
		}, {
			title: '专业',
			dataIndex: 'description5'
		}, {
			title: '描述的WBS对象',
			dataIndex: 'description6'
		}, {
			title: '描述的设计对象',
			dataIndex: 'description7'
		}, {
			title: '上传人员',
			dataIndex: 'description8'
		}];


		return (
			<div >
				<Row style={{ marginBottom: "10px" }}>
					<Button type="default">模板下载</Button>
					<Button style={{ marginLeft: '10PX' }} onClick={this.toggleAddition.bind(this)} type="default" >发起填报</Button>
					<Button style={{ marginLeft: '10PX' }} onClick={this.toggleModify.bind(this)} type="default">申请变更</Button>
					<Button style={{ marginLeft: '10PX' }} onClick={this.toggleExpurgate.bind(this)} type="default">申请删除</Button>
					<Button style={{ marginLeft: '10PX' }} type="default">导出表格</Button>
					<Search
						style={{ width: "200px", marginLeft: 10 }}
						placeholder="输入搜索内容"
						onSearch={value => console.log(value)}
					/>
				</Row>
				{//<Button style={{ marginLeft: 10 }} type="primary" onClick={this.togglecheck.bind(this)}>审核</Button>
				}
				<Row>
					<Table
						size="middle"
						bordered
						columns={columns}
						rowSelection={rowSelection}
						rowKey="_id"
					/>
				</Row>
			</div>
		);
	}
	toggleAddition() {
		const {addtion = {}, actions: { changeAdditionField } } = this.props;
		console.log(this.props)
		changeAdditionField('visible', true)
		changeAdditionField('key', addtion.key?addtion.key+1:1)
	}
	toggleCheck() {
		const { actions: { changeCheckField } } = this.props;
		console.log(this.props)
		changeCheckField('visible', true)
	}
	toggleModify() {
		const { actions: { changeModifyField } } = this.props;
		console.log(this.props)
		changeModifyField('visible', true)
	}
	toggleExpurgate() {
		const { actions: { changeExpurgateField } } = this.props;
		console.log(this.props)
		changeExpurgateField('visible', true)
	}
}


