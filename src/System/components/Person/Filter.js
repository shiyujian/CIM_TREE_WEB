import React, {Component} from 'react';
import {Row, Col, Form, Input, Button, Select} from 'antd';

const FormItem = Form.Item;
const {Option, OptGroup} = Select;
export default class Filter extends Component {
	render() {
		const {platform: {roles = []}, filter = {}, actions: {changeFilterField}} = this.props;
		const systemRoles = roles.filter(role => role.grouptype === 0);
		const projectRoles = roles.filter(role => role.grouptype === 1);
		const professionRoles = roles.filter(role => role.grouptype === 2);
		const departmentRoles = roles.filter(role => role.grouptype === 3);
		return (
			<Row gutter={24}>
				<Col span={7}>
					<FormItem {...Filter.layout} label="用户名">
						<Input placeholder="请输入用户名" value={filter.username} onChange={changeFilterField.bind(this, 'username')}/>
					</FormItem>
				</Col>
				<Col span={7}>
					<Select placeholder="请选择角色" value={filter.role} onChange={changeFilterField.bind(this, 'role')}
					        mode="multiple" style={{width: '100%'}}>
						<OptGroup label="苗圃角色">
							{
								systemRoles.map(role => {
									return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
								})
							}
						</OptGroup>
						<OptGroup label="施工角色">
							{
								projectRoles.map(role => {
									return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
								})
							}
						</OptGroup>
						<OptGroup label="监理角色">
							{
								professionRoles.map(role => {
									return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
								})
							}
						</OptGroup>
						<OptGroup label="业主角色">
							{
								departmentRoles.map(role => {
									return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
								})
							}
						</OptGroup>
					</Select>
				</Col>
				<Col span={3}>
					<Button onClick={this.query.bind(this)}>查询</Button>
				</Col>
			</Row>
		);
	}

	query() {
		const {filter = {}, sidebar: {node} = {}, actions: {getUsers}} = this.props;
		const codes = Filter.collect(node);
		getUsers({}, {org_code: codes, ...filter});
	}

	static collect = (node = {}) => {
		const {children = [], code} = node;
		let rst = [];
		rst.push(code);
		children.forEach(n => {
			const codes = Filter.collect(n);
			rst = rst.concat(codes);
		});
		return rst;
	};

	static layout = {
		labelCol: {span: 8},
		wrapperCol: {span: 16},
	};
}
