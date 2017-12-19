import React, {Component} from 'react';
import {Modal, Input, Form, Button} from 'antd';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;


export default class Addition extends Component {
	render() {
		const {addition = {}, actions: {changeAdditionField}} = this.props;
		return (
			<Modal title="新建字段" visible={addition.visible} onCancel={this.cancel.bind(this)} onOk={this.save.bind(this)}>
				<FormItem {...Addition.layout} label="字段名称">
					<Input value={addition.name} onChange={changeAdditionField.bind(this, 'name')}/>
				</FormItem>
				<FormItem {...Addition.layout} label="字段级别">
					<ButtonGroup>
						<Button type={addition.is_system_owned ? 'primary' : ''} 
						        onClick={changeAdditionField.bind(this, 'is_system_owned', true)}>系统级字段</Button>
						<Button type={addition.is_system_owned ? '' : 'primary'}
						        onClick={changeAdditionField.bind(this, 'is_system_owned', false)}>普通字段</Button>
					</ButtonGroup>
				</FormItem>
				<FormItem {...Addition.layout} label="字段类型">
					<ButtonGroup>
						<Button type={addition.is_flow ? 'primary' : ''} disabled={addition.is_system_owned ? true : false}
						        onClick={changeAdditionField.bind(this, 'is_flow', true)}>流水码字段</Button>
						<Button type={addition.is_flow ? '' : 'primary'} disabled={addition.is_system_owned ? true : false}
						        onClick={changeAdditionField.bind(this, 'is_flow', false)}>常规字段</Button>
					</ButtonGroup>
				</FormItem>
			</Modal>
		);
	}

	save() {
		const {
			addition = {},
			actions: {postFields, getFields, getSystemFields, clearAdditionField}
		} = this.props;
		let postdata = {
			name: addition.name,
		}
		if(addition.is_system_owned){
			postdata.is_system_owned = true
		} else if(addition.is_flow){
			postdata.app_type = "serial"
		}
		postFields({},postdata).then(rst => {
			if (rst) {
				if (addition.is_system_owned) {
					getSystemFields();
					clearAdditionField();
				} else {
					getFields();
					clearAdditionField();
				}
			}
		})
	}

	cancel() {
		const {
			actions: {clearAdditionField}
		} = this.props;
		clearAdditionField();
	}

	static layout = {
		labelCol: {span: 4},
		wrapperCol: {span: 18},
	};
}
