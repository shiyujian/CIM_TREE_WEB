import React, {Component} from 'react';
import {DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

@connect(
	state => {
		const {platform} = state;
		return {platform};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions}, dispatch),
	}),
)
export default class Contact extends Component {

	static propTypes = {};

	render() {
		return (
			<div><DynamicTitle title="工作联系单" {...this.props}/></div>
		);
	}
}

