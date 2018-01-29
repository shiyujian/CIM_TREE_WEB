import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store';
import Plan from '../components/Plan';
import { actions as platformActions } from '_platform/store/global';

@connect(
	state => {
		const { platform } = state;
		return { platform };
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions }, dispatch),
	}),
)
export default class Plans extends Component {
	render() {
		return (
			<div>
				<Plan />
			</div>
        )
	}
}