import React, {Component} from 'react';
import {Modal, Form, Input} from 'antd';

const FormItem = Form.Item;

export default class Addition extends Component {
	render() {
		const addition = {};
		return (
			<Modal>
				<FormItem {...Addition.layout} label="父节点">
					<Input value={addition.name}/>
				</FormItem>
			</Modal>
		);
	}
}
