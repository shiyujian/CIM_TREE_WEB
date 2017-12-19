import React, {Component} from 'react';
import {Radio, Button, Row, Col, Popover, Icon, Table, Select} from 'antd';
import {CODE_PROJECT} from '_platform/api';
import CodeStructure from '_platform/components/panels/CodeStructure';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;

export default class Fields extends Component {

	render() {
		const {groupFields = [], codeGroups = [], groups = [], codeTypes = [], sidebar = {}, dictValues = [],codeGroupStructure = {}} = this.props;
		const {type = 1, field = {}, struct = [], name} = sidebar;
		return (
			<div style={{margin:'0 auto',boxShadow:' 0 -2px 3px rgba(0, 0, 0, .1)',padding:'10px',minHeight:"300px"}}>
				<div style={{textAlign: 'center', marginBottom: 16}}>
					<RadioGroup onChange={this.toggleType.bind(this)} value={type} style={{width: "100%"}}>
						<RadioButton value={1} style={{width: "50%"}} disabled={struct.length && type === 2}>字段</RadioButton>
						<RadioButton value={2} style={{width: "50%"}} disabled={struct.length && type === 1}>编码组</RadioButton>
					</RadioGroup>
				</div>

				<RadioGroup onChange={this.toggleField.bind(this)} value={field}>
					{
						type === 1 && groupFields.map((field, index) => {
							return (
								<Radio key={index} value={field} style={{display: 'block', lineHeight: '24px'}}>
									{field}
								</Radio>);
						})
					}
					{
						type === 2 && groups.map(codeGroup => {
							const content = (
								<div>
									<CodeStructure dataSource={codeGroupStructure} disabled/>
								</div>);
							return (
								<div key={codeGroup.ref_struct_id}>
										<Radio value={codeGroup.code_type_name} style={{lineHeight: '24px'}}>
											{codeGroup.code_type_name}
										</Radio>
										<Popover content={content} placement="right" trigger="click">
											<a onClick={this.check.bind(this, codeGroup.code_type_name)}>查看</a>
										</Popover>
								</div>);
						})
					}
				</RadioGroup>
			</div>
		);
	}
	check(name, event) {
		event.preventDefault();
		const {actions: {getCodeGroupStructure}} = this.props;
		getCodeGroupStructure({}, {name, code_type: name})
	}
	componentDidMount() {

	}

	toggleType(event) {
		console.log(event)
		const value = event.target.value;
		const {groupFields = [], groups = [], actions: {changeSidebarField}} = this.props;
		changeSidebarField('type', value)
		try{
			if(value === 1) {
				this.toggleFieldAuto(groupFields[0],value)
			} else {
				this.toggleFieldAuto(groups[0].code_type_name,value)
			}
		} catch(e) {
			console.log(e)
		}
	}

	toggleFieldAuto(value,type) {
		const {
			actions: {changeSidebarField, getProjectCodes, getProjectFieldValues, getCodeGroupStructure}
		} = this.props;
		if (type === 1) {
			changeSidebarField('field', value);
			getProjectFieldValues({}, {project: CODE_PROJECT, dict_field: value});
		} else {
			changeSidebarField('field', value);
			getProjectCodes({}, {project: CODE_PROJECT, code_type: value});
		}
	}

	toggleField(event) {
		const value = event.target.value;
		const {
			sidebar = {},
			actions: {changeSidebarField, getProjectCodes, getProjectFieldValues, getCodeGroupStructure}
		} = this.props;
		const {type = 1} = sidebar;
		if (type === 1) {
			changeSidebarField('field', value);
			getProjectFieldValues({}, {project: CODE_PROJECT, dict_field: value});
		} else {
			changeSidebarField('field', value);
			getProjectCodes({}, {project: CODE_PROJECT, code_type: value});
		}
	}
}
