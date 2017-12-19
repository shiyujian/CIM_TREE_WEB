import React, { Component } from 'react';
import { Modal, Input, Form, Button, message } from 'antd';
import { CODE_PROJECT } from '_platform/api';

const FormItem = Form.Item;

export default class Addition extends Component {
	render() {
		const { addition = {}, actions: { changeAdditionField } } = this.props;
		return (
			<Modal title={addition.isadd ? "新建字典" : "编辑字典"}
				visible={addition.visible}
				onCancel={this.cancel.bind(this)}
				onOk={this.save.bind(this)}>
				<FormItem {...Addition.layout} label="编码名称">
					<Input  value={addition.alias} onChange={changeAdditionField.bind(this, 'alias')} />
				</FormItem>
				<FormItem {...Addition.layout} label="编码值">
					<Input disabled={addition.isadd ? false : true} value={addition.value} onChange={changeAdditionField.bind(this, 'value')} />
				</FormItem>
				<FormItem {...Addition.layout} label="编码描述">
					<Input value={addition.description} onChange={changeAdditionField.bind(this, 'description')} />
				</FormItem>
			</Modal>
		);
	}

	save() {
		const { addition = {}, sidebar = {},
			actions: { getProjectFieldValues, postProjectFieldValue, patchProjectFieldValue, getDictValues, clearAdditionField } } = this.props;
		if (addition.isadd) {
			postProjectFieldValue({}, {
				project: CODE_PROJECT,
				dict_field_name: sidebar.field,
				value: addition.value,
				alias: addition.alias,
				description: addition.description
			}).then(rst => {
				console.log('haobuhao',rst)
				if (rst) {
					message.success('创建成功')
					// this.getDictValue()
					clearAdditionField()
					getProjectFieldValues({}, { project: CODE_PROJECT, dict_field: sidebar.field });
				} else {
					message.error(`创建失败,错误原因：${JSON.stringify(rst)}`)
				}
			})
		} else {
			patchProjectFieldValue(
				{
					dict_field_name: sidebar.field,
					value: addition.value,
				}, {
					alias: addition.alias,
					description: addition.description

				}).then(rst => {
					if (rst && rst._id) {
						console.log('rst',rst)
						message.success('更新成功')
						getProjectFieldValues({}, { project: CODE_PROJECT, dict_field: sidebar.field });
						clearAdditionField();
					} else {
						message.error(`更新失败,错误原因：${JSON.stringify(rst)}`)
					}
				})
		}
	}



cancel() {
	const {
			actions: { clearAdditionField }
		} = this.props;
	clearAdditionField();
}

	static layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 18 },
};
}
