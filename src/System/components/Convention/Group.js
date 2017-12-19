import React, { Component } from 'react';
import { Modal, Input, Form, Select, message } from 'antd';
import CodeStructure from '_platform/components/panels/CodeStructure';
import { CODE_PROJECT } from '_platform/api';

const FormItem = Form.Item;
const Option = Select.Option;

export default class Group extends Component {
	constructor(props) {
		super(props);
		this.state = {
			key: -1,
			fields: [],
			values: {}
		};
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps)
		if (nextProps.sidebar && nextProps.sidebar.key && nextProps.sidebar.key !== this.state.key) {
			const { sidebar = {}, actions: { getCodeGroupStructure } } = this.props;
			const { field } = sidebar;
			const { group: { field_values } } = nextProps;
			let values = {};
			getCodeGroupStructure({}, { name: field, code_type: field })
				.then(rst => {
					const { all_fields = [] } = rst;
					this.getFieldOptions(all_fields);
					all_fields.forEach((item, index) => {
						values[item] = field_values[index]
					})
				})
			this.setState({ key: nextProps.sidebar.key, values })

		}
		// const {codeGroupStructure = {}} = this.props;
		// const {all_fields = []} = codeGroupStructure;
		// const {codeGroupStructure: nextCodeGroupStructure = {}} = nextProps;
		// const {all_fields: next_fields = []} = nextCodeGroupStructure;
		// if (next_fields.length !== all_fields.length) {
		// 	this.getFieldOptions(next_fields);
		// // }
	}

	getFieldOptions(all_fields = []) {
		const { actions: { getProjectFieldValues } } = this.props;
		const fields = all_fields.filter((item, pos) => all_fields.indexOf(item) === pos);

		const promises = fields.map(field => {
			return getProjectFieldValues({}, { project: CODE_PROJECT, dict_field: field })
		});
		Promise.all(promises).then((rst = []) => {
			const state = {};
			fields.forEach((field, index) => {
				const { results = [] } = rst[index] || {};
				state[field] = results.map(item => {
					return <Option key={item.value}>{item.value}</Option>
				}
				);
			});
			this.setState({ fields: state });
		});
	}

	render() {
		const { group = {}, codeGroupStructure = {}, actions: { changeGroupField } } = this.props;
		const { all_fields = [] } = codeGroupStructure;
		const { fields = [], values = {} } = this.state;
		return (
			<Modal title={group.isadd ? "新建字典" : "编辑字典"}
				width={800}
				visible={group.visible} onCancel={this.cancel.bind(this)}
				onOk={this.save.bind(this)}
			>
				<FormItem {...Group.layout} label="编码名称">
					<Input value={group.name} onChange={changeGroupField.bind(this, 'name')} />
				</FormItem>
				<FormItem {...Group.layout} label="编码描述">
					<Input value={group.description} onChange={changeGroupField.bind(this, 'description')} />
				</FormItem>
				<FormItem {...Group.layout} label="编码值">
					<CodeStructure dataSource={codeGroupStructure}>
						<tr>
							<td className="title">字段值</td>
							{
								all_fields.map((field, index) => {
									return (
										<td key={index}>
											<Select onChange={this.changeCode.bind(this, field)}
												disabled={group.isadd ? false : true}
												value={values[field]}
												style={{ width: '100%' }}
											>
												{fields[field]}
											</Select>
										</td>)
								})
							}
						</tr>
					</CodeStructure>
				</FormItem>
			</Modal>
		);
	}

	save() {
		const { codeGroupStructure = {}, group = {}, sidebar = {}, actions: { getProjectCodes, postProjectCode, clearGroupField, patchProjectCode } } = this.props;
		const { all_fields = [] } = codeGroupStructure;
		const { field } = sidebar;
		const { values = {} } = this.state;
		const valueList = all_fields.map(field => {
			return values[field];
		}).filter(value => typeof value !== 'undefined');
		if (group.isadd) {
			postProjectCode({}, {
				project: CODE_PROJECT,
				code_type: sidebar.field,
				name: group.name,
				description: group.description,
				full_code: valueList.join('-'), // todo connection
				field_values: valueList,
				segment_values: [],
			}).then(rst => {
				if (rst._id) {
					message.success('创建成功')
					clearGroupField()
					getProjectCodes({}, { project: CODE_PROJECT, code_type: field });
				} else {
					message.error(`创建失败,错误原因：${JSON.stringify(rst)}`)
				}
			});
		} else {
			patchProjectCode(
				{
					code_type: sidebar.field,
					full_code: valueList.join('-'),
				}, {
					name: group.name,
					description: group.description,
				}).then(rst => {
					if (rst._id) {
						message.success('修改成功')
						clearGroupField()
						getProjectCodes({}, { project: CODE_PROJECT, code_type: field });
					} else {
						message.error(`修改失败,错误原因：${JSON.stringify(rst)}`)
					}
				});
		}

	}

	changeCode(field, value) {
		const { values = {} } = this.state;
		this.setState({
			values: { ...values, [field]: value }
		});
	}

	cancel() {
		const {
			actions: { clearGroupField }
		} = this.props;
		clearGroupField();
	}

	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
}
