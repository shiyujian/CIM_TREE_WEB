import React, { Component } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';

export default class Users extends Component {
	render() {
		const { platform: { users = [] } } = this.props;
		console.log(this.props);
		return (
			<div>
				<div>
					<Button onClick={this.append.bind(this)}>添加用户</Button>
					<Popconfirm title="是否真的要删除选中用户?"
						onConfirm={this.remove.bind(this)} okText="是" cancelText="否">
						<Button>批量删除</Button>
					</Popconfirm>
				</div>
				<Table rowKey="id" size="middle" bordered rowSelection={this.rowSelection} columns={this.columns} dataSource={users} />
			</div>
		);
	}

	columns = [{
		title: '序号',
		dataIndex: 'index',
	}, {
		title: '姓名',
		dataIndex: 'person_name',
	}, {
		title: '编码',
		dataIndex: 'person_code',
	}, {
		title: '用户名',
		dataIndex: 'username',
	}, {
		title: '性别',
		dataIndex: 'gender',
	}, {
		title: '角色',
		render: (user) => {
			const { groups = [] } = user || {};
			const roles = groups.map(group => group.name);
			return roles.join('、')
		}
	}, {
		title: '职务',
		dataIndex: 'title',
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
		dataIndex: 'relative_signature_url',
		render: (sign) => {
			return <img width={30} src={`${sign}`} alt="" />;
		}
	}, {
		title: '头像',
		dataIndex: 'relative_avatar_url',
		render: (avatar) => {
			return <img width={20} src={`${avatar}`} alt="" />;
		}
	}, {
		title: '操作',
		render: (user) => {
			return [
				<a onClick={this.edit.bind(this, user)} key={1} style={{ marginRight: '.5em' }}>编辑</a>,
				<Popconfirm title="是否真的要删除用户?" key={2}
					onConfirm={this.del.bind(this, user)} okText="是" cancelText="否">
					<a>删除</a>
				</Popconfirm>
			]
		}
	}];

	rowSelection = {
		onChange: (selectedRowKeys) => {
			this.selectedCodes = selectedRowKeys;
		}
	};

	append() {
		const {
			sidebar: { node } = {},
			actions: { changeAdditionField }
		} = this.props;
		console.log(this.props)
		if (node.children && node.children.length > 0) {
			message.warn('请选择最下级组织结构目录');
		} else {
			changeAdditionField('visible', true);

		}

	}

	remove() {
		const {
			sidebar: { node } = {},
			actions: { deleteUser, getUsers }
		} = this.props;
		const codes = Users.collect(node);
		this.selectedCodes.map((userId) => {
			return deleteUser({ userID: userId }).then(() => {
				getUsers({}, { org_code: codes });
			});
		});
	}

	edit(user, event) {
		event.preventDefault();
		const account = user.account;
		const groups = user.groups || [];
		const {
			actions: { resetAdditionField }
		} = this.props;
		resetAdditionField({
			visible: true,
			roles: groups.map(group => String(group.id)),
			...user,
			...account,

		});
	}

	del(user) {
		const {
			sidebar: { node } = {},
			actions: { deleteUser, getUsers }
		} = this.props;
		const codes = Users.collect(node);
		if (user.id) {
			deleteUser({ userID: user.id }).then(() => {
				getUsers({}, { org_code: codes });
			});
		}
	}

	static collect = (node = {}) => {
		const { children = [], code } = node;
		let rst = [];
		rst.push(code);
		children.forEach(n => {
			const codes = Users.collect(n);
			rst = rst.concat(codes);
		});
		return rst;
	}
}
