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
			dataIndex: 'numbers',
		}, {
			title: '模型编码',
			dataIndex: 'coding'
		}, {
			title: '项目/子项目名称',
			dataIndex: 'project'
		}, {
			title: '单位工程',
			dataIndex: 'unitEngineering'
		}, {
			title: '模型名称',
			dataIndex: 'modelName'
		}, {
			title: '提交单位',
			dataIndex: 'submittingUnit'
		}, {
			title: '模型描述',
			dataIndex: 'modelDescription'
		}, {
			title: '模型类型',
			dataIndex: 'modeType'
		}, {
			title: 'fdb模型',
			dataIndex: 'fdbMode'
		}, {
			title: 'tdbx模型',
			dataIndex: 'tdbxMode'
		}, {
			title: '属性表',
			dataIndex: 'attributeTable'
		}, {
			title: '上报时间',
			dataIndex: 'reportingTime'
		}, {
			title: '上报人',
			dataIndex: 'reportingName'
		}];

		return (
			<div>
				<Row >
					<Button type="default" style={{marginRight:10}}>模板下载</Button>
					<Button style={{ margin: '10px' }} onClick={this.toggleAddition.bind(this)} type="default" >发起填报</Button>
					<Button style={{ margin: '10px' }} onClick={this.toggleModify.bind(this)} type="default">申请变更</Button>
					<Button style={{ margin: '10px' }} onClick={this.toggleExpurgate.bind(this)} type="default">申请删除</Button>
					<Button style={{ margin: '10px' }} type="default">导出表格</Button>
					<Search
						style={{ width: "200px", marginLeft: 10 }}
						placeholder="输入搜索条件"
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
		const { actions: { changeAdditionField } } = this.props;
		console.log(this.props)
		changeAdditionField('visible', true)
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


