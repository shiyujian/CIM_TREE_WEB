import React, {Component} from 'react';
import {Radio, Button, Row, Col, Popover, Icon, Table, Select} from 'antd';
import {CODE_PROJECT} from '_platform/api';
import CodeStructure from '_platform/components/panels/CodeStructure';
const Option = Select.Option;

export default class Fields extends Component {
	constructor(props) {
		super(props);
		this.state = {
			codetypeoption:[],
			struct:{},
			codetype: ''
		};
	}
	componentDidMount() {
		const {actions:{getCodeTypes}} = this.props;
		getCodeTypes()
		.then(rst => {
			if(rst&&rst.results){
				let codetypeoption = rst.results.map((codetype,index) => {
					return <Option key={index} value={codetype.name}>
						{codetype.name}
					</Option>
				})
				this.setState({codetypeoption,codetype:rst.results[0].name},() => {
					this.codetypesel(rst.results[0].name)
				})
			}
		})
	}

	render() {
		const {codetypeoption,struct,codetype} = this.state
		return (	
			<div style={{margin:'0 auto',boxShadow:' 0 -2px 3px rgba(0, 0, 0, .1)',padding:'10px',minHeight:"300px"}}>
				<Row>
					<Col span={24}>
						<span>
							选择编码类型：
						</span>
						<Select 
						 value={codetype}
						 style={{width:"200px"}} 
						 onChange={this.codetypesel.bind(this)}
						>
							{codetypeoption}
						</Select>
					</Col>
				</Row>
				<Row style={{marginTop:"10px"}}>
					<Col span={24}>
						<CodeStructure dataSource={struct}/>	
					</Col>
				</Row>
			</div>
		);
	}


	codetypesel(value) {
		this.setState({codetype:value})
		const {codeTypes, sidebar = {}, actions: {getCodeGroupStructure,changeSidebarField}} = this.props;
		const {type = 1} = sidebar;
		let procodetype = codeTypes.find(rst => rst.name === value)
		getCodeGroupStructure({},{name:value,code_type:value})
		.then(rst =>{
			rst.fields_connections = procodetype.fields_connections
			rst.field_restrictions = procodetype.field_restrictions			
			this.setState({struct:rst})
		})
		changeSidebarField('name', value);
		this.getFields(value, type);
	}

	getFields(name, type) {
		const {actions: {getGroups, getGroupFields}} = this.props;
		getGroups({}, {name, code_type: name})
		.then(rst => {
			if (type === 2) {
				try{
					this.toggleField(rst.code_groups[0].code_type_name)
				} catch(e) {
					console.log(e)
				}
			}
		});
		getGroupFields({}, {name, code_type: name})
		.then(rst => {
			if (type === 1) {
				try{
					this.toggleField(rst.fields[0])
				} catch(e) {
					console.log(e)
				}
			}
		});
	}

	toggleField(value) {
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
