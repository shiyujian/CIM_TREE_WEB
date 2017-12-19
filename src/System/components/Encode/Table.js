import React, {Component} from 'react';
import {Table} from 'antd';

export default class CodeTable extends Component {
	render() {
		return (
			<Table columns={this.columns}/>
		);
	}

	columns = [{
		title: '序号',
		dataIndex: 'index'
	}, {
		title: '编码',
		dataIndex: 'code'
	}, {
		title: '名称',
		dataIndex: 'name'
	}, {
		title: '别名',
		dataIndex: 'ali'
	}, {
		title: '描述',
		dataIndex: 'desc'
	}, {
		title: '专业',
		dataIndex: 'p'
	}, {
		title: '用途',
		dataIndex: 'feature'
	}, {
		title: '版本',
		dataIndex: 'version'
	}, {
		title: '操作',
		dataIndex: 'c'
	}]
}
