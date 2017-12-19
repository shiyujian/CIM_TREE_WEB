import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './CodeStructure.less';
import * as actions from '../../store/global/dict';
import {Input, Popover, Button, Select, message} from 'antd';
import CodeStructure from './CodeStructure';
import {DOMAIN_CODES, CODE_PROJECT} from '../../api';

const Option = Select.Option;

@connect(
	state => {
		const {platform = {}} = state;
		return platform;
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	}),
)
export default class CodePicker extends Component {
	static propTypes = {
		dataSource: PropTypes.object,
		name: PropTypes.string
	};

	constructor(props) {
		super(props);
		this.state = {
			value: '',
			values: {},
			visible: false,
			structure: {},
			fieldConnections: []
		}
	}

	componentDidMount() {
		const {type, actions: {getCodeGroupStructure, getCodeType}} = this.props;
		const codeType = DOMAIN_CODES[type] || {};
		getCodeGroupStructure({}, {name: codeType, code_type: codeType}).then(rst => {
			const {all_fields = []} = rst || {};
			this.setState({
				structure: rst
			});
			this.getFieldOptions(all_fields);
		});
		getCodeType({}, {name: codeType}).then(rst => {
			const {fields_connections = []} = rst;
			this.setState({fieldConnections: fields_connections});
			console.log(333, rst);
		})
	}


	getFieldOptions(all_fields = []) {
		const {actions: {getProjectFieldValues}} = this.props;
		const fields = all_fields.filter((item, pos) => all_fields.indexOf(item) === pos);

		const promises = fields.map(field => {
			return getProjectFieldValues({}, {project: CODE_PROJECT, dict_field: field})
		});
		Promise.all(promises).then((rst = []) => {
			const state = {};
			fields.forEach((field, index) => {
				const {results = []} = rst[index] || {};
				state[field] = results.map(item => {
						return <Option key={item.value}>{item.value}</Option>
					}
				);
			});
			this.setState({fields: state});
		});
	}


	render() {
		const {structure = {}, fields = {}, values = {}, value = ''} = this.state;
		const {all_fields = []} = structure || {};
		return (
			<div className="code-picker">
				<div style={{marginRight: 70}}>
					<Popover style={{width: '200%'}} placement="bottom" visible={this.state.visible}
					         content={
						         <CodeStructure {...this.props} dataSource={structure} trigger="focus"
						                        onChange={this.change.bind(this)} onClose={this.close.bind(this)}>
							         <tr>
								         <td className="title">字段值</td>
								         {
									         all_fields.map((field, index) => {
										         return (
											         <td key={index}>
												         <Select onChange={this.change.bind(this, field)} value={values[field]} style={{width: '100%'}}>
													         {fields[field]}
												         </Select>
											         </td>)
									         })
								         }
							         </tr>
						         </CodeStructure>}>
						<Input size="default" readOnly value={value} onFocus={this.focus.bind(this)}/>
					</Popover>
				</div>
				<div style={{position: 'absolute', right: 0, top: 0}}>
					<Button size="default" type="primary" onClick={this.save.bind(this)}>生成</Button>
				</div>
			</div>);
	}

	focus() {
		this.setState({visible: true});
	}

	close() {
		this.setState({visible: false});
	}

	save() {
		const {actions: {postProjectCode}, name = '', parent = '', description = '', alias = '', code_type = ''} = this.props;
		let {fieldValues = [], groupValues = [], value} = this.state;
		const segmentValues = groupValues.map(group => {
			return group.values.join('')
		});
		if (!name) {
			message.warn('请填写名称')
		} else if (!value) {
			message.warn('请选择编码')
		} else {
			postProjectCode({}, {
				project: CODE_PROJECT,
				full_code: value,
				field_values: fieldValues,
				segment_values: groupValues,
				code_type,
				name,
				description,
				alias,
				parent,
			}).then(rst => {
				const {full_code} = rst;
				const {onOk} = this.props;
				if (full_code) {
					onOk && onOk(full_code, rst);
					this.setState({visible: false});
					message.success('编码已保存')
				}
			});
		}

	}

	change(field, value) {
		const {onChange} = this.props;
		let {values} = this.state;
		values = {...values, [field]: value};
		const codes = this.getValues(values);
		const groupValues = this.getGroupValues(values);
		this.setState({values, fieldValues: codes, groupValues, value: codes.join('')});
		onChange && onChange(codes.join(''));
	}

	getValues(values) {
		const {structure: {all_fields = []} = {}, fieldConnections} = this.state;
		const rst = [];
		all_fields.forEach((field, index) => {
			const value = values[field];
			if (value) {
				if (index > 0) { //先添加上一个间隔符
					rst.push(fieldConnections[index - 1]);
				}
				rst.push(value);
			}
		});
		return rst;
	}

	getGroupValues(values) {
		const {dataSource: {detailed_struct = {}, all_code_groups = []} = {}} = this.props;
		const groupValues = [];
		this.loopGroup(detailed_struct, values, groupValues);
		let rst;
		rst = groupValues.filter(value => all_code_groups.some(group => group.code_type_name === value.group));
		return rst;
	}

	loopGroup(structure = {}, values, rst = []) {
		const {code_type, struct_list: structures = []} = structure;
		if (code_type) {
			let codes = [];
			structures.forEach(s => {
				const fields = this.loopGroup(s, values, rst);
				if (Array.isArray(fields)) {
					codes = codes.concat(fields);
				} else {
					codes.push(fields);
				}
			});
			rst.push({
				group: code_type,
				values: codes
			});
			return codes;
		} else {
			return values[structure];
		}
	}

}
