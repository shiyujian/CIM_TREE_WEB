import React, {Component} from 'react';
import {Modal, Form, Input, message} from 'antd';
import {CUS_TILEMAP} from '_platform/api';

const FormItem = Form.Item;

export default class Info extends Component {

	static propTypes = {};

	render() {
		const {
			addition = {},
			actions: {changeAdditionField}
		} = this.props;
		return (
			<Modal title="添加角色" visible={addition.visible}
			maskClosable={false}
			       onOk={this.save.bind(this)}
			       onCancel={this.cancel.bind(this)}>
				<FormItem {...Info.layout} label="角色名称">
					<Input placeholder="请输入角色名称" value={addition.name} onChange={changeAdditionField.bind(this, 'name')}/>
				</FormItem>
				<FormItem {...Info.layout} label="角色描述">
					<Input placeholder="请输入描述" value={addition.description} onChange={changeAdditionField.bind(this, 'description')}/>
				</FormItem>
			</Modal>);
	}

	save() {
		const {
			addition = {}, actions: {getRoles, postRole, clearAdditionField, putRole}
		} = this.props;
		if (!addition.name) {
			message.warn('请输入角色名称')
		} else {
			if (addition.id) {
				putRole({id: addition.id}, {
					name: addition.name,
					permissions: [],
					grouptype: addition.type,
					description: addition.description
				}).then(rst => {
					if (rst.id) {
						clearAdditionField();
						getRoles();
					}
				})
			} else {
				postRole({}, {
					name: addition.name,
					permissions: [],
					grouptype: addition.type,
					description: addition.description
				}).then(rst => {
					if (rst.id) {
						clearAdditionField();
						getRoles();
					}
				})
			}
		}
	}

	cancel() {
		const {actions: {clearAdditionField}} = this.props;
		clearAdditionField();
	}

	static layout = {
		labelCol: {span: 6},
		wrapperCol: {span: 18},
	};
}
