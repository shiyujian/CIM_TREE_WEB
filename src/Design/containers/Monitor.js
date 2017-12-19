import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Content, DynamicTitle} from '_platform/components/layout';
import {Type, Filter, Table} from '../components/Monitor';
import {actions} from '../store/monitor';
import {actions as platformActions} from '_platform/store/global';

@connect(
	state => {
		const {monitor = {}, platform} = state.design || {};
		return {...monitor, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Monitor extends Component {

	static propTypes = {};

	render() {
		return (
			<Content>
				<DynamicTitle title="报审监控" {...this.props}/>
				<Filter {...this.props}/>
				<Table {...this.props}/>
			</Content>
		);
	}
};
