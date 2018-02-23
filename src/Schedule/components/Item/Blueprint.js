import React, {Component} from 'react';
import {Table, message, Modal, Spin, Icon, Col, Row, Button} from 'antd';

export default class Blueprint extends Component {

	static propTypes = {};

	render() {
		const {documents = []} = this.props;
		return (
			<div>
				<Table title={this.title} rowSelection={this.rowSelection} dataSource={documents} columns={this.columns} bordered rowKey="code"/>
			</div>
		);
	}

	title() {
		return <h4>图纸列表</h4>
	}

	edit(blueprint) {
		const {actions: {changeTableField, getDocument}} = this.props;
		getDocument({code: blueprint.code});
		changeTableField('editing', true);
	}

	remove(blueprint) {
		const {sidebar: {node}, actions: {deleteDocument, getDocuments, toggleEditing}} = this.props;
		deleteDocument({code: blueprint.code}).then(() => {
			message.success('删除成功！');
			toggleEditing();
			getDocuments({code: node});
		});
	}

	columns = [{
		title: '序号',
		render: (text, record, index) => {
			return index + 1;
		}
	}, {
		title: '图纸名称',
		dataIndex: 'name',
	}, {
		title: '图号',
		dataIndex: 'code',
		// }, {
		//     title: '专业',
		//     dataIndex: 'rel_type',
	}, {
		title: '图纸阶段', // todo 先写死 施工图阶段
		render: () => {
			return '施工图阶段';
		}
	}, {
		title: '文件类型',
		dataIndex: 'obj_type',
		render: () => { // todo 先写死
			return '文档';
		}
	}, {
		title: '分项填报状态',
		render: () => { // todo 先写死
			return '执行中';
		}
	}, {
		title: '查看',
		render: (record) => {
			let files = record.basic_params.files || [];
			let nodes = [];
			{
				files.map((file, index) => {
					nodes.push(<a key={index}
					              onClick={this.previewFile.bind(this,
						              file)}>文件预览</a>);
				});
			}
			return nodes;
		},
	}, {
		title: '操作',
		render: (blueprint) => {
			return (
				<span>
                    <a onClick={this.edit.bind(this, blueprint)}>
                        <Icon type="edit"/>
                    </a>
                    <span className="ant-divider"/>
                    <a onClick={this.remove.bind(this, blueprint)}>
                        <Icon type="delete"/>
                    </a>
                </span>
			);
		},
	}];

	previewFile(file) {
		const {actions: {openPreview, closeLoading}} = this.props;
		openPreview(file);
		setTimeout(() => {
			closeLoading();
		}, 1500);
	}
}
