import React, {Component} from 'react';
import {Modal, Row, Col, Form, Input,Select} from 'antd';
import {CUS_TILEMAP} from '_platform/api';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

class Addition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Arrays:[]
		};
	}
	static propTypes = {};

	render() {
		const {
			form: {getFieldDecorator},
			sidebar: {node = {}, parent} = {}, addition = {},
			actions: {changeAdditionField}
		} = this.props;
		const { type, extra_params: extra = {}, obj_type } = node || {};
		
		const title = Addition.getTitle(node, parent);
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
				<FormItem {...Addition.layout} label={`${title}标段`}>
					<Select placeholder="标段" value={addition.sections} onChange={changeAdditionField.bind(this, 'sections')}
						mode="multiple" style={{ width: '100%' }}>
						<Option key={'P009-01-01'} >1标段</Option>
						<Option key={'P009-01-02'} >2标段</Option>
						<Option key={'P009-01-03'} >3标段</Option>
						<Option key={'P009-01-04'} >4标段</Option>
						<Option key={'P009-01-05'} >5标段</Option>
					</Select>
				</FormItem>
				<FormItem {...Addition.layout} label={`${title}简介`}>
					<Input  placeholder="请输入简介" value={addition.introduction} type="textarea" rows={4}
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
		console.log(addition.sections)
		console.log(addition.sections.join())
		const sections=addition.sections.join()
		console.log(sections)
		// return;
		if (parent) {
			postOrg({}, {
				name: addition.name,
				code: addition.code,
				
				obj_type: 'C_ORG',
				status: 'A',
				extra_params: {
					introduction: addition.introduction,
					sections:sections,
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
				obj_type: 'C_ORG',
				status: 'A',
				name: addition.name,
				extra_params: {
					introduction: addition.introduction,
					sections:sections,
				}
			}).then(rst => {
				this.forceUpdate();				
				if (rst.pk) {
					console.log(rst.pk)
					console.log(addition)
					console.log(parent)
					changeSidebarField('addition', false);
					parent && changeSidebarField('parent', null);
					addition.code && clearAdditionField();
					getOrgTree({}, {depth: 3});
					this.forceUpdate();				
				
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
export default Form.create()(Addition)

