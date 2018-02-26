import React, { Component } from 'react';
import { Table, Spin } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import '../../../Datum/components/Datum/index.less'

export default class TaskTable extends Component {

	static propTypes = {};

	onChange = (pagination, filters, sorter) => {
		const {
			actions: { setTablePage }
		} = this.props;
		setTablePage(pagination)
	}
	render() {
		const rowSelection = {
			// selectedRowKeys,
			onChange: this.onSelectChange,
		};
		//console.log("TaskTable  ====  ", this.state, this.props);
		let loading = this.props.loadingstatus ? this.props.loadingstatus : false;
		const { platform: { tasks = [] }, pagination = {} } = this.props;
		console.log(tasks)
		tasks.forEach((task, index) => {
			task.index = index + 1;
		});
		return (
			<Spin tip="加载中" spinning={loading}>
				<Table columns={this.columns} dataSource={tasks}
					rowSelection={rowSelection}
					bordered
					className="foresttables"
					onChange={this.onChange.bind(this)}
					pagination={pagination} />
			</Spin>
		);
	}

	columns = [
		{
			title: '序号',
			dataIndex: 'index',
		}, {
			title: '任务名称',
			dataIndex: 'name',
		}, {
			title: '任务类型',
			dataIndex: 'type',
		}, {
			title: '发起人',
			dataIndex: 'creatorName',
		}, {
			title: '发起时间',
			dataIndex: 'real_start_time',
			sorter: (a, b) => moment(a['real_start_time']).unix() - moment(b['real_start_time']).unix(),
			render: text => {
				return moment(text).format('YYYY-MM-DD');
			}
		},
		{
			title: '当前执行人',
			dataIndex: 'executorName',
		},
		{
			title: '流转状态',
			dataIndex: 'status',
		}, {
			title: '操作',
			render: (item) => {
				const { id, state: { id: stateId = '' } = {} } = item;
				return <Link to={`/selfcare/task/${id}?state_id=${stateId}`}>查看</Link>;
			},
		}];

};