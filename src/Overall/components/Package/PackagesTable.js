import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table} from 'antd';

export default class PackagesTable extends Component {

	static propTypes = {
		dataSource: PropTypes.array,
		selectedKey: PropTypes.string,
		onSelect: PropTypes.func,
	};


	render() {
		const {packagesData:packagesData = {
			children:[]
		}}=this.props;
		return (
			<Table dataSource={packagesData.children}
				   columns={this.columns}
				   rowKey="code"
			/>
		);
	}
	columns = [
		{
			title: '编码',
			dataIndex: 'code',
			key: 'code',
		},{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '类型',
			dataIndex: 'obj_type_hum',
			key: 'obj_type_hum',
		}
	];
}
