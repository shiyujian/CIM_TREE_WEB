import React, {Component} from 'react';
import {Form, Input, Button} from 'antd';
import {CUS_TILEMAP} from '_platform/api';

const FormItem = Form.Item;

export default class Info extends Component {

	static propTypes = {};

	render() {
		const {
			sidebar: {node = {}} = {}, addition = {},
			actions: {changeAdditionField}
		} = this.props;
		const {type, extra_params: extra = {}, obj_type} = node || {};
		const title = Info.getTitle(type);
		return (
			<div style={{marginBottom: 20}}>
				<div style={{borderBottom: '1px solid #e9e9e9', paddingBottom: 5, marginBottom: 20}}>
					<span style={{fontSize: 16, fontWeight: 'bold', paddingRight: '1em'}}>{`${title}管理`}</span>
					{type === 'org' && <Button type="primary" ghost onClick={this.addCompany.bind(this)}>新建单位</Button>}
					{type === 'company' && <Button type="primary" ghost onClick={this.addDepartment.bind(this)}>新建部门</Button>}
					<Button onClick={this.edit.bind(this)} style={{float: 'right'}} type="primary" ghost>编辑</Button>
				</div>
				<FormItem {...Info.layout} label={`${title}名称`}>
					<Input readOnly value={node.name}/>
				</FormItem>
				<FormItem {...Info.layout} label={`${title}编码`}>
					<Input readOnly value={node.code}/>
				</FormItem>
				<FormItem {...Info.layout} label={`${title}简介`}>
					<Input type="textarea" rows={4} readOnly value={extra.introduction}/>
				</FormItem>
			</div>);
	}

	addCompany() {
		const {sidebar: {node = {}} = {}, actions: {changeAdditionField, changeSidebarField}} = this.props;
		changeSidebarField('parent', node);
		changeAdditionField('visible', true);
	}

	addDepartment() {
		const {sidebar: {node = {}} = {}, actions: {changeAdditionField, changeSidebarField}} = this.props;
		changeSidebarField('parent', node);
		changeAdditionField('visible', true);
	}

	edit() {
		const {
			sidebar: {node} = {},
			actions: {changeSidebarField, resetAdditionField}
		} = this.props;
		changeSidebarField('parent', undefined);
		resetAdditionField({
			visible: true,
			...node,
			...node.extra_params
		});
	}

	static getTitle(type) {
		switch (type) {
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
		labelCol: {span: 4},
		wrapperCol: {span: 20},
	};
}
