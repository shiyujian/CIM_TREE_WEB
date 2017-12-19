import React, {Component} from 'react';
import {Modal, Row, Col, Form, Input} from 'antd';
import {CUS_TILEMAP} from '_platform/api';

const FormItem = Form.Item;

export default class Addition extends Component {

	static propTypes = {};

	render() {
		const {
			sidebar: {node = {}, parent} = {}, addition = {},
			actions: {changeAdditionField}
		} = this.props;
		const {type} = node;
		const title = Addition.getTitle(node, parent);
		return (
			<Modal title={parent ? `新建${title} | ${parent.name}` : `编辑${title} | ${node.name}`}
			       visible={addition.visible} onOk={this.save.bind(this)} onCancel={this.cancel.bind(this)}>
				<FormItem {...Addition.layout} label={`${title}名称`}>
					<Input placeholder="请输入名称" value={addition.name} onChange={changeAdditionField.bind(this, 'name')}/>
				</FormItem>
				<FormItem {...Addition.layout} label={`${title}编码`}>
					<Input readOnly={!parent} placeholder="请输入编码" value={addition.code}
					       onChange={changeAdditionField.bind(this, 'code')}/>
				</FormItem>
			</Modal>);
	}

	save() {
		const {
			sidebar: {parent} = {}, addition = {},
			actions: {postOrg, putOrg, getOrgTree, changeSidebarField, clearAdditionField}
		} = this.props;
		if (parent) {
			postOrg({}, {
				name: addition.name,
				code: addition.code,
				obj_type: 'C_ORG',
				status: 'A',
				extra_params: {
					introduction: addition.introduction
				},
				parent: {pk: parent.pk, code: parent.code, obj_type: 'C_ORG'}
			}).then(rst => {
				getOrgTree({}, {depth: 3});
			});
		} else {
			putOrg({code: addition.code}, {
				name: addition.name,
				extra_params: {
					introduction: addition.introduction
				}
			}).then(rst => {
				changeSidebarField('addition', false);
				parent && changeSidebarField('parent', null);
				addition.code && clearAdditionField();
				getOrgTree({}, {depth: 3});
			});
		}

	}

	cancel() {
		const {actions: {clearAdditionField}} = this.props;
		clearAdditionField();
	}

	static getTitle(node, parent) {
		if (parent && parent.code) {
			switch (parent.type) {
				case 'org':
					return '单位';
				case 'company':
					return '部门';
				default:
					return '机构类型';
			}
		}
		switch (node.type) {
			case 'org':
				return '机构类型';
			case 'company':
				return '单位';
			case 'department':
				return '部门';
			default:
				return '';
		}
	}

	static layout = {
		labelCol: {span: 6},
		wrapperCol: {span: 18},
	};
}
