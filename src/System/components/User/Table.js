import React, {Component} from 'react';
import {Table, Button, Popconfirm} from 'antd';

export default class Users extends Component {
	render() {
		const {platform: {users = []}} = this.props;
		return (
			<div>
				<div>
					<Button onClick={this.append.bind(this)}>添加用户</Button>
					<Popconfirm title="是否真的要删除选中项目?"
					            onConfirm={this.remove.bind(this)} okText="是" cancelText="否">
						<Button>批量删除</Button>
					</Popconfirm>
				</div>
				<Table rowKey="id" rowSelection={this.rowSelection} columns={this.columns} dataSource={users}/>
			</div>
		);
	}

	componentDidMount() {
		const {actions: {getUsers}} = this.props;
		getUsers();
	}

	columns = [{
		title: '序号',
		dataIndex: 'index',
	}, {
		title: '姓名',
		dataIndex: 'person_name',
	}, {
		title: '编码',
		dataIndex: 'code',
	}, {
		title: '用户名',
		dataIndex: 'username',
	}, {
		title: '性别',
		dataIndex: 'sex',
	}, {
		title: '角色',
		dataIndex: 'role',
	}, {
		title: '职务',
		dataIndex: '职务',
	}, {
		title: '手机号码',
		dataIndex: 'person_telephone',
	}, {
		title: '邮箱',
		dataIndex: 'email',
	}, {
		title: '所属部门',
		dataIndex: 'organization',
	}, {
		title: '电子签章',
		dataIndex: 'sign',
	}, {
		title: '头像',
		dataIndex: 'logo',
	}, {
		title: '操作',
		dataIndex: 'creatorName',
	}];

	rowSelection = {
		onChange: (selectedRowKeys) => {
			this.selectedCodes = selectedRowKeys;
		}
	};

	append() {
		const {
			actions: {changeAdditionField}
		} = this.props;
		changeAdditionField('visible', true);
	}

	remove() {
		const {actions: {deleteUser, getUsers}} = this.props;
		this.selectedCodes.map((userId) => {
			return deleteUser({userID: userId});
		});
	}
}
