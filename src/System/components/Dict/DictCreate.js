import React, {Component} from 'react';
import {Modal, Input, Form, message} from 'antd';

const FormItem = Form.Item;


export default class DictCreate extends Component {
	render() {
		const {dictcreate = {}, actions: {changeDictcreateField}} = this.props;
		return (
			<Modal 
			 title={dictcreate.isadd?"新建字典":"编辑字典"}
			 visible={dictcreate.visible} 
			 onCancel={this.cancel.bind(this)} 
			 onOk={this.save.bind(this)} 
			>
				<div>
					<FormItem {...DictCreate.layout} label="编码值">
						<Input disabled={dictcreate.isadd?false:true} value={dictcreate.value} onChange={changeDictcreateField.bind(this, 'value')}/>
					</FormItem>
					<FormItem {...DictCreate.layout} label="名称">
						<Input value={dictcreate.implication} onChange={changeDictcreateField.bind(this, 'implication')}/>
					</FormItem>
					<FormItem {...DictCreate.layout} label="描述">
						<Input value={dictcreate.description} onChange={changeDictcreateField.bind(this, 'description')}/>
					</FormItem>
				</div>
			</Modal>
		);
	}

	save() {
		const {
			dictcreate = {},
			fieldname,
			actions: {postDictValues, patchDictValue, getDictValues, clearDictcreateField}
		} = this.props;
		console.log('woshi',this.props)
		if(dictcreate.isadd) {
			postDictValues({}, {
				dict_field_name: fieldname,
				implication: dictcreate.implication,
				value: dictcreate.value,
				description: dictcreate.description,
			}).then(rst => {
				if (rst&&rst._id) {
					message.success('创建成功')
					this.getDictValue()
					clearDictcreateField();
				} else {
					message.error(`创建失败,错误原因：${JSON.stringify(rst)}`)
				}
			})
		} else {
			patchDictValue({dict_field:fieldname,value:dictcreate.value}, {
				implication: dictcreate.implication,
				description: dictcreate.description,
			}).then(rst => {
				if (rst&&rst._id) {
					message.success('更新成功')
					this.getDictValue()
					clearDictcreateField();
				} else {
					message.error(`更新失败,错误原因：${JSON.stringify(rst)}`)
				}
			})
		}
	}
	getDictValue() {
		const {fieldname,actions:{getDictValues,setDictLoading}} = this.props;
		setDictLoading(true)
		getDictValues({},{dict_field:fieldname,per_page:100})
		.then(rst => {
			setDictLoading(false)
		})
	}
	cancel() {
		const { actions: {clearDictcreateField}} = this.props;
		clearDictcreateField();
	}

	static layout = {
		labelCol: {span: 4},
		wrapperCol: {span: 18},
	};
}
