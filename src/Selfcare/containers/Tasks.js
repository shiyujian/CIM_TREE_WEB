import React, { Component } from 'react';
import { Content, DynamicTitle } from '_platform/components/layout';
import { Type, Filter, Table } from '../components/Tasks';
import { actions } from '../store/tasks';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUser } from '_platform/auth';

@connect(
	state => {
		const { selfcare: { tasks = {} } = {}, platform } = state;
		return { ...tasks, platform };
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions }, dispatch),
	}),
)
export default class Tasks extends Component {

	static propTypes = {};

	async componentDidMount() {
		const {
			filter = {},
			platform = {},
			actions: { getTasks, getUsers, setLoadingStatus }
		} = this.props;
		const { type = 'processing' } = filter;
		const user = getUser();
		getUsers();
		// if (platform && platform.tasks && platform.tasks.length != 0) {
		// 	return
		// } else {
			setLoadingStatus(true);
			await getTasks({}, { ...filter, task: type, executor: user.id, order_by: "-real_start_time" });
			setLoadingStatus(false);
		// }
	}

	render() {
		//console.log("****任务列表****", this.props)
		return (
			<Content>
				<DynamicTitle title="个人任务" {...this.props} />
				<Type {...this.props} />
				<Filter {...this.props} />
				<Table {...this.props} />
			</Content>
		);
	}
};
