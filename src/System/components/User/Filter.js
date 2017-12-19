import React, {Component} from 'react';
import {Row, Col, Form, Input, Button} from 'antd';

const FormItem = Form.Item;

export default class Filter extends Component {
	render() {
		const {filter = {}, actions: {changeFilterField}} = this.props;
		return (
			<Row gutter={24}>
				<Col span={7}>
					<FormItem {...Filter.layout} label="用户名称">
						<Input placeholder="请输入名称" value={filter.name} onChange={changeFilterField.bind(this, 'name')}/>
					</FormItem>
				</Col>
				<Col span={7}>
					<FormItem {...Filter.layout} label="角色">
						<Input placeholder="请输入编码" value={filter.code} onChange={changeFilterField.bind(this, 'code')}/>
					</FormItem>
				</Col>
				<Col span={7}>
					<FormItem {...Filter.layout} label="角色">
						<Input placeholder="请输入编码" value={filter.code} onChange={changeFilterField.bind(this, 'code')}/>
					</FormItem>
				</Col>
				<Col span={3}>
					<Button>查询</Button>
				</Col>
			</Row>
		);
	}

	static layout = {
		labelCol: {span: 8},
		wrapperCol: {span: 16},
	};
}
