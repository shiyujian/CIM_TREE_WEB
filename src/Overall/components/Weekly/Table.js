import React, {Component} from 'react';
import {Table, Spin} from 'antd';
import Preview from 'components/layout/Preview'
export default class WeeklyDetail extends Component {
	constructor(props) {
		super(props);
	}

	static propTypes = {};

	render() {
		const {weeklyLists} = this.props;
		let columns = [{
			title: '序号',
			dataIndex: 'no',
		}, {
			title: '周报名称',
			dataIndex: 'extra_params.name',
		}, {
			title: '任务事项',
			dataIndex: 'extra_params.job',
		}, {
			title: '本周落实情况',
			dataIndex: 'extra_params.done',
		}, {
			title: '计划完成时间',
			dataIndex: 'extra_params.time',
		}, {
			title: '工作进度',
			dataIndex: 'extra_params.how',
		}, {
			title: '备注',
			dataIndex: 'extra_params.remark',
		}, {
			title: '预览',
			render: (record) => {
				let files = record.basic_params.files || [];
				let nodes = [];
				{
					files.map((file, index) => {
						nodes.push(<span key={index}><a onClick={this.previewFile.bind(this, file)}>预览</a></span>)
					})
				}
				return nodes;
			},
		}];
		const {tableLoading} = this.props;
		return (
			<div>
				<Spin spinning={tableLoading} tip="数据加载中，请稍等...">
					<Table columns={columns} dataSource={weeklyLists} bordered rowKey="no"/>
				</Spin>
				<Preview />
			</div>
		);
	}

	previewFile(file) {
		const {openPreview, closeLoading} = this.props;
		openPreview(file);
		setTimeout(() => {
			closeLoading();
		}, 1500);
	}
}


