import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import reducer, {actions} from '../store/index';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import moment from 'moment';

@connect(
	state => {
		const {platform} = state || {};
		return { platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Pricedata extends Component {
	componentDidMount() {

	}
	render() {
        const {
        } = this.props;

		return (
			<Body>
			<Main>
				<DynamicTitle title="价格数据" {...this.props}/>
				<Sidebar>
				</Sidebar>
				<Content>
				</Content>
			</Main>
			</Body>
		);
	}
}
