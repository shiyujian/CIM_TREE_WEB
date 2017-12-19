import React, {Component} from 'react';
import {Input, Button} from 'antd';

const InputSearch = Input.Search;

export default class Search extends Component {
	render() {
		return (
			<div>
				<Button onClick={this.toggle.bind(this)} style={{marginRight: '1em'}} type="primary">新增字段</Button>
				<InputSearch placeholder="输入字段" style={{width: 300}} onSearch={value => console.log(value)}/>
			</div>
		);
	}

	componentDidMount() {
		const {actions: {getFields, getSystemFields}} = this.props;
		getFields();
		getSystemFields();
	}

	toggle(event) {
		const {actions: {changeAdditionField}} = this.props;
		changeAdditionField('visible', true);
	}
}
