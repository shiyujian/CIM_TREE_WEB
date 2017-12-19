import React, {Component} from 'react';
import {Modal, Row, Col, Form, Input, Button} from 'antd';

const FormItem = Form.Item;

export default class Filter extends Component {
	render() {
		return (
			<div>
				<Button onClick={this.append.bind(this)}>添加用户</Button>
				<Button onClick={this.remove.bind(this)}>批量删除</Button>
			</div>
		);
	}


}
