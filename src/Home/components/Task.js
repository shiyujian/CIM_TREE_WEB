import React, {Component} from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {getUser} from '_platform/auth';

export default class Task extends Component {

	static propTypes = {};

	componentDidMount() {
		const {actions: {getTasks}} = this.props;
		const user = getUser();
		getTasks({}, {task: 'processing', executor: user.id})
	}


	render() {
		const {platform: {tasks = []}} = this.props;
		return (
			<div style={{height: "100%"}}>
				{
					tasks.map((task) => {
						return (
							<div key={task.id} style={{listStyle: 'none'}}>
								<Link to={`/selfcare/task/${task.id}`}>{task.name}~{moment(task.time).format('YYYY-MM-DD HH:mm:ss')}</Link>
							</div>);
					})
				}
			</div>
		);
	}
}
