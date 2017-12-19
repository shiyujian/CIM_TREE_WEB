import React, {Component} from 'react';
import {Select, Form} from 'antd';
import {getUser} from '../../../_platform/auth';

const {Option, OptGroup} = Select;
const FormItem = Form.Item;

export default class UserPicker extends Component {

	constructor(props) {
		super(props);
		this.state = {
			usersOptions: []
		}
	}

	render() {
		const {state = {}} = this.props;
        const {name} = state;
		const {users = []} = this.state;
		return (
			<div style={{marginTop: 10}}>
				<FormItem {...UserPicker.layout} label={`${name}执行人`}>
					<Select style={{width: '100%'}}
					        mode="multiple"
					        placeholder="请输入执行人姓名"
					        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					        onSearch={this.fetchNode}
					        defaultActiveFirstOption={false}
					        onChange={this.handleChange.bind(this)}>
						{
							users.map(group => {
								return (
									<OptGroup label={group.name} key={group.id}>
										{
											group.children.map(user => {
												return <Option key={user.id} value={String(user.id)}>{user.name}</Option>
											})
										}
									</OptGroup>)
							})
						}
					</Select>
				</FormItem>
			</div>
		);
	}

	componentDidMount() {
		const {state = {}, actions: {getUsers, getRole, getMembers} = {},users2={}} = this.props;
        const {roles = [], orgs = []} = state;
		if (roles.length) {
			const roleDetails = roles.map(role => getRole({id: role}));
			Promise.all(roleDetails).then(roleList => {
				const promises = roleList.map(role => getMembers({id: role}));
				Promise.all(promises).then((allMembers) => {
					const rst = [];
					const roleOptions = allMembers.map((members, index) => {
						const role = roleList[index];
						return {
							id: role.id,
							name: role.name,
							children: members.map(member => {
								const {id, account: {person_name} = {}} = member;
								rst.push(member);
								return {
									id, person_name
								}
							})
						}
					});
					this.setState({users: roleOptions, persons: rst})
				});
			});
		} else if (orgs.length) {
			getUsers({}, {org_code: orgs}).then(rst => {
				if (rst.length) {
					const tmp = {};
					const orgs = [];
					rst.forEach(user => {
							const {id, account: {person_name, org_code, organization} = {}} = user;
							if (!tmp[org_code]) {
								tmp[org_code] = {
									id: org_code, name: organization,
									children: [{id, name: person_name}]
								};
								orgs.push(org_code);
							} else {
								tmp[org_code].children.push({id, name: person_name});
							}
						}
					);
					const users = orgs.map(org => tmp[org]);
					this.setState({users, persons: rst})
				}
			});

		} else {
			if (users2.length) {
				const tmp = {};
				const orgs = [];
				users2.forEach(user => {
						const {id, account: {person_name, org_code, organization} = {}} = user;
						if (!tmp[org_code]) {
							tmp[org_code] = {
								id: org_code, name: organization,
								children: [{id, name: person_name}]
							};
							orgs.push(org_code);
						} else {
							tmp[org_code].children.push({id, name: person_name});
						}
					}
				);
				const users = orgs.map(org => tmp[org]);
				this.setState({users,persons: users2})
			}
		}
	}

	handleChange(values) {
		const {onChange} = this.props;
		const {persons = []} = this.state;
		const users = persons.filter(person => values.some(value => +value === person.id));
		onChange && onChange(users);
	}

	static layout = {
		labelCol: {span: 4},
		wrapperCol: {span: 16},
	};
}
