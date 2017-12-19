import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Content, DynamicTitle} from '_platform/components/layout';
import {Type, Filter, Table} from '../components/Monitor';

import {actions as platformActions} from '_platform/store/global';
import SubmitPanel from '../components/Explain/SubmitPanel'

@connect(
	state => {
		const { platform} = state;
		return { platform};
	},
	dispatch => ({
		actions: bindActionCreators({ ...platformActions}, dispatch),
	}),
)
class ExplainSubmit extends Component {

	static propTypes = {};

	render() {
		return (
			<Content>
				<DynamicTitle title="交底填报" {...this.props}/>
                交底填报
				<SubmitPanel {...this.props}/>
			</Content>
		);
	}
};

export default ExplainSubmit;