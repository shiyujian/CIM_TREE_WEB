import React, {Component} from 'react';
import {Modal, Row, Col, Form, Input} from 'antd';
import {CUS_TILEMAP} from '_platform/api';

const FormItem = Form.Item;

class Addition extends Component {

	static propTypes = {};

	render() {
		const {
			form: {getFieldDecorator},
			sidebar: {node = {}, parent} = {}, addition = {},
			actions: {changeAdditionField}
		} = this.props;

		console.log(this.props)

		const {type} = node;
		const title = Addition.getTitle(node, parent);
		console.log('title',title)
		console.log('parent',parent)
		return (
			<Modal title={parent ? `新建${title} | ${parent.name}` : `编辑${title} | ${node.name}`}
			maskClosable={false}
			       visible={addition.visible} onOk={this.save.bind(this)} onCancel={this.cancel.bind(this)}>
				<FormItem {...Addition.layout} label={`${title}名称`}>
					<Input placeholder="请输入名称" value={addition.name} onChange={changeAdditionField.bind(this, 'name')}/>
				</FormItem>
				<FormItem {...Addition.layout} label={`${title}编码`}>
				   {getFieldDecorator('code', {
				   	  rules: [{required: true, message: '必须为英文字母、数字以及 -_~`*!.[]{}()的组合'	,pattern:/^[\w\d\_\-]+$/}],
                     initialValue: ''
                    })(
                    <Input readOnly={!parent} placeholder="请输入编码" value={addition.code}
					onChange={changeAdditionField.bind(this, 'code')}/>                                    )}
					
				</FormItem>
				<FormItem {...Addition.layout} label={`${title}简介`}>
					<Input readOnly={!parent} placeholder="请输入简介" value={addition.introduction} type="textarea" rows={4}
					       onChange={changeAdditionField.bind(this, 'introduction')}/>
				</FormItem>
			</Modal>);
	}

	save() {
		const {
			sidebar: {parent} = {}, addition = {},
			actions: {postOrg, putOrg, getOrgTree, changeSidebarField, clearAdditionField, postRole}
		} = this.props;
		console.log(this.props)
		console.log(addition.introduction)
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
				if (rst.pk) {
					clearAdditionField();
					getOrgTree({}, {depth: 3});
				}
			});
		} else {
			putOrg({code: addition.code}, {
				name: addition.name,
				extra_params: {
					introduction: addition.introduction
				}
			}).then(rst => {
				if (rst.pk) {
					changeSidebarField('addition', false);
					parent && changeSidebarField('parent', null);
					addition.code && clearAdditionField();
					getOrgTree({}, {depth: 3});
				}
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
				case 'project':
					return '机构类型';
				case 'org':
					return '单位';
				case 'company':
					return '部门';
				default:
					return '项目';
			}
		}
		switch (node.type) {
			case 'project':
				return '项目';
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
export default Form.create()(Addition)

