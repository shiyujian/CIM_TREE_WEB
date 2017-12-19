import React, { Component } from 'react';
import { Button, Table, Icon, Popconfirm, message } from 'antd';
import Card from '_platform/components/panels/Card';
import { CODE_PROJECT} from '_platform/api';
export default class DictTable extends Component {
	render() {
		let that = this;
		const columns = [{
			title: '序号',
			dataIndex: 'index',
		}, {
			title: '编码值',
			dataIndex: 'value'
		}, {
			title: '名称',
			dataIndex: 'alias'
		}, {
			title: '描述',
			dataIndex: 'description'
		}, {
			title: '操作',
			render: (text, record, index) => {
				return <span>
					<a className="fa fa-edit" style={{ fontSize: "20px", margin: '0 5px' }} onClick={this.edit.bind(this, record)}></a>
					<Popconfirm
						title={`确定删除?`}
						onConfirm={this.handleDeleteRow.bind(this, record.value)}
						okText="是"
						cancelText="否"
					>
						<a className="fa fa-trash" style={{ fontSize: "20px", margin: '0 5px' }} ></a>
					</Popconfirm>
				</span>
			}
		}];

		const groupsColumns = [{
			title: '序号',
			dataIndex: 'index',
		}, {
			title: '编码值',
			dataIndex: 'full_code'
		}, {
			title: '名称',
			dataIndex: 'name'
		}, {
			title: '描述',
			dataIndex: 'description'
		}, {
			title: '操作',
			render: (text, record, index) => {
				return <span>
					<a className="fa fa-edit" style={{ fontSize: "20px", margin: '0 5px' }} onClick={this.edit.bind(this, record)}></a>
					<Popconfirm
						title={`确定删除?`}
						onConfirm={this.handleDeletegroup.bind(this, record.full_code)}
						okText="是"
						cancelText="否"
					>
						<a className="fa fa-trash" style={{ fontSize: "20px", margin: '0 5px' }} ></a>
					</Popconfirm>
				</span>
			}
		}]

		const {
			projectFieldValues = [], projectCodes = [], sidebar = {},
		} = this.props;
		const { type = 1 } = sidebar;
		return (
			<div style={{ margin: '0 auto', boxShadow: ' 0 -2px 3px rgba(0, 0, 0, .1)', padding: '10px', minHeight: "300px" }}>
				<Card title="工程约束列表" extra={
					<div>
						<Button style={{ marginRight: 10 }} type="primary" onClick={this.toggleAddition.bind(this)}>单个创建</Button>
						<Button style={{ marginRight: 10 }} type="primary" onClick={this.toggleImported.bind(this)}>文件上传导入</Button>
						<Button type="primary">批量导出</Button>
					</div>}>
					{
						type === 1 && <Table size="middle" bordered columns={columns} dataSource={projectFieldValues} rowKey="_id" />
					}
					{
						type === 2 && <Table size="middle" bordered columns={groupsColumns} dataSource={projectCodes} rowKey="_id" />
					}

				</Card>
			</div>
		);
	}

	toggleAddition() {
		const {
			sidebar = {},
			actions: { changeAdditionField, changeGroupField, changeSidebarField }
		} = this.props;
		const { type = 1 } = sidebar;
		let { key = 1 } = sidebar;
		if (type === 1) {
			changeAdditionField('visible', true);
			changeAdditionField('isadd', true);
		} else {
			changeGroupField('visible', true)
			changeGroupField('isadd', true)
			changeSidebarField('key', ++key);
		}
	}

	edit(record) {
		const { sidebar = {}, actions: { changeAdditionField, changeGroupField, changeSidebarField } } = this.props;
		const { type = 1 } = sidebar;
		console.log('a', record)
		let { key = 1 } = sidebar;
		if (type === 1) {
			changeAdditionField('visible', true);
			changeAdditionField('value', record.value);
			changeAdditionField('alias', record.alias);
			changeAdditionField('description', record.description);
			// changeAdditionField('implication', record.implication);
			// changeAdditionField('description', record.description);
			changeAdditionField('isadd', false);
		} else {
			changeGroupField('visible', true)
			changeGroupField('isadd', false);
			changeGroupField('description', record.description);
			changeGroupField('name', record.name);
			changeGroupField('field_values', record.field_values);
			changeSidebarField('key', ++key);
		}


	}


	handleDeleteRow(record) {
		console.log('record', record)
		const { sidebar = {}, actions: { deleteProjectFieldValue, getProjectFieldValues } } = this.props;

		deleteProjectFieldValue({
			dict_field_name: sidebar.field,
			value: record,
		}).then(rst => {
			console.log(rst)
			if (rst == undefined) {
				message.success('删除成功')
			    getProjectFieldValues({},{project: CODE_PROJECT,dict_field: sidebar.field});
			} else {
				message.error(`删除失败,错误原因：${JSON.stringify(rst)}`)
				
			}
		})
	}

	handleDeletegroup(record) {
		console.log('a', record)
		const { sidebar = {}, actions: { deleteProjectCode, getProjectCodes } } = this.props;

		deleteProjectCode({
			code_type: sidebar.field,
			full_code: record,
		}).then(rst => {
			console.log(rst)
			if (rst == undefined) {
				message.success('删除成功')
				getProjectCodes({},{project: CODE_PROJECT,code_type: sidebar.field})
			} else {
				message.error(`删除失败,错误原因：${JSON.stringify(rst)}`)
				
			}
		})
	}
	toggleImported() {
		const { actions: { changeImportedField } } = this.props;
		changeImportedField('visible', true);
	}


}


