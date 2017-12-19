import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table} from 'antd';

export default class Tables extends Component {

	static propTypes = {
		dataSource: PropTypes.array,
		selectedKey: PropTypes.string,
		onSelect: PropTypes.func,
	};


	render() {
		const {tablesData=[]}=this.props;
		return (
			<Table dataSource={tablesData}
				   columns={this.columns}
				   size="small"
				   rowKey="code"
			/>
		);
	}
	columns = [
		{
			title: '分部',
			dataIndex: 'ptr',
			key: 'ptr',
		}, {
			title: '子分部',
			dataIndex: 'ptr_s',
			key: 'ptr_s',
		}, {
			title: '分项',
			dataIndex: 'itm',
			key: 'itm',
		}
	];
}
