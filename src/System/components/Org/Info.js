import React, { Component } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { CUS_TILEMAP } from '_platform/api';


const FormItem = Form.Item;
const { Option, OptGroup } = Select;

export default class Info extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Arrays:[]
		};
	}
	static propTypes = {};
	render() {
		const {
			sidebar: { node = {} } = {}, addition = {},
			actions: { changeAdditionField }
		} = this.props;
		console.log('this.props',this.props)
		const {type, extra_params: extra = {}, obj_type} = node || {};
		const title = Info.getTitle(type);
		console.log('type',type)
		return (
			<div style={{marginBottom: 20}}>
				<div style={{borderBottom: '1px solid #e9e9e9', paddingBottom: 5, marginBottom: 20}}>
					<span style={{fontSize: 16, fontWeight: 'bold', paddingRight: '1em'}}>{`${title}管理`}</span>
					{type === 'project' && <Button type="primary" ghost onClick={this.addProject.bind(this)}>新建组织机构</Button>}
					{type === 'org' && <Button type="primary" ghost onClick={this.addCompany.bind(this)}>新建单位</Button>}
					{type === 'company' && <Button type="primary" ghost onClick={this.addDepartment.bind(this)}>新建部门</Button>}
					<Button onClick={this.edit.bind(this)} style={{ float: 'right' }} type="primary" ghost>编辑</Button>
				</div>
				<FormItem {...Info.layout} label={`${title}名称`}>
					<Input readOnly value={node.name} />
				</FormItem>
				<FormItem {...Info.layout} label={`${title}编码`}>
					<Input readOnly value={node.code} />
				</FormItem>
				<FormItem {...Info.layout} label={`${title}标段`}>
					<Input  readOnly value={extra.sections} />
				</FormItem>
				<FormItem {...Info.layout} label={`${title}简介`}>
					<Input type="textarea" rows={4} readOnly value={extra.introduction} />
				</FormItem>
			</div>);
	}

	addProject() {
		const {sidebar: {node = {}} = {}, actions: {changeAdditionField, changeSidebarField}} = this.props;
		changeSidebarField('parent', node);
		changeAdditionField('visible', true);
	}

	addCompany() {
		const { sidebar: { node = {} } = {}, actions: { changeAdditionField, changeSidebarField } } = this.props;
		changeSidebarField('parent', node);
		changeAdditionField('visible', true);
	}

	addDepartment() {
		const { sidebar: { node = {} } = {}, actions: { changeAdditionField, changeSidebarField } } = this.props;
		changeSidebarField('parent', node);
		changeAdditionField('visible', true);
	}

	edit() {
		const {
			sidebar: { node } = {},
			actions: { changeSidebarField, resetAdditionField }
		} = this.props;
		console.log(11111111,node);
		if(typeof node.extra_params.sections=='string'){
			node.extra_params.sections=node.extra_params.sections?(node.extra_params.sections.split(",")):[];
			node.extra_params.sections=node.extra_params.sections==''?[]:node.extra_params.sections
		}

		changeSidebarField('parent', undefined);
		resetAdditionField({
			visible: true,
			...node,
			...node.extra_params
		});
	}

	static getTitle(type) {
		switch (type) {
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
		labelCol: { span: 4 },
		wrapperCol: { span: 20 },
	};
}
