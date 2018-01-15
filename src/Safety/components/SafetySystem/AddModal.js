import React, {Component} from 'react';
import {Table, Modal} from 'antd';

export default class AddModal extends Component{

	render() {
		const {addVisible} = this.props;

		const columns = [{
			title:"主题",
			dataIndex: 'order',
		},{
			title:"编码",
			dataIndex: 'attrs.zzbm',
		},{
			title:"工程名称",
			dataIndex: 'section',
		},{
			title:"文档类型",
			dataIndex: 'place',
		},{
			title:"提交单位",
			dataIndex: 'treetype',
		},{
			title:"提交人",
			dataIndex: 'factory',
		},{
			title:"提交时间",
			dataIndex: 'nurseryname',
		},{
			title:"流程状态",
			dataIndex: 'nurseryname',
		},{
			title:"操作",
			dataIndex: 'nurseryname',
		}];

		return (
			<Modal
				visible = {true}
				width = {1200}
				onCancel={this.cancel.bind(this)}
			>
				<Table
					bordered
					columns = {columns}
				/>
			</Modal>
		)
	}

	cancel() {
        const { actions: { AddVisible } } = this.props;
        AddVisible(false);
    }
}