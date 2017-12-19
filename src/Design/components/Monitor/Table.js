import React, {Component} from 'react';
import {Table} from 'antd';
import moment from 'moment';
import {Link} from 'react-router-dom';

export default class TaskTable extends Component {

	static propTypes = {};

	render() {
		const {tasks = []} = this.props;
		return (
			<Table columns={this.columns} dataSource={tasks} bordered rowKey="id"/>
		);
	}

	columns = [
		{
			title: '序号',
			dataIndex: 'id',
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
			render: text => {
				return moment(text).format('YYYY-MM-DD HH:mm:ss');
			}
		}, {
			title: '发起日期',
			dataIndex: 'plan_start_time',
			render: text => {
				return moment(text).format('YYYY-MM-DD HH:mm:ss');
			}
		}, {
			title: '当前执行人',
			dataIndex: 'executorName'
		}, {
			title: '流转状态',
			dataIndex: 'status',
		}, {
			title: '查看',
			render: (item) => {
				const {router} = this.props;
				const {id, name} = item;
				return <Link title={`${name}详情`} to={`/selfcare/task/${id}`} router={router}>查看</Link>;
			},
		}];
};
