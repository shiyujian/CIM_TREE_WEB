import React, { Component } from 'react';
import { Row, Col, Form, Select, Input, Button } from 'antd';
// import './AccountTable.less'

const FormItem = Form.Item;

export default class AccountTable extends Component {

	render() {
		const {platform: {users = []}} = this.props;
		console.log('users', users)
		return (
			<div>
				{
					users.length > 0 
					?
					(<Row>
						<Col>
							<Row>
								<Col>
									<FormItem {...AccountTable.layoutT} label="用户名">
										{users[0].username}
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormItem {...AccountTable.layoutT} label="姓名">
										{users[0].person_name}
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormItem {...AccountTable.layoutT} label="电子签名">
										{users[0].person_name}
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormItem {...AccountTable.layoutT} label="手机号码">
										{users[0].account.person_telephone}
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormItem {...AccountTable.layoutT} label="邮箱">
										<Input style={{width: 160}} value={users[0].email}/>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormItem {...AccountTable.layoutT} label="性别" value={users[0].gender}>
										<Select style={{width: 42}}>
											<Option value="男">男</Option>
		                            		<Option value="女">女</Option>
										</Select>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormItem {...AccountTable.layoutT} label="所属部门">
										{users[0].org_code}
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormItem {...AccountTable.layoutT} label="职位">
										<Input style={{width: 160}} value={users[0].account.title}/>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormItem {...AccountTable.layoutT} label="角色">
										<Input style={{width: 160}} value={users[0].groups[0].name}/>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormItem {...AccountTable.layoutT} label="密码">
										<Input style={{width: 160}} value="*******"/>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Button type='primary' style={{marginRight: 20}}>
									修改
								</Button>
								<Button type='primary'>
									取消
								</Button>
							</Row>
						</Col>
						<Col>
							
						</Col>
					</Row>)
					:
					'没有数据'
				}
			</div>
		)
	}

	static layoutT = {
		labelCol: {span: 2},
		wrapperCol: {span: 12},
	};
}