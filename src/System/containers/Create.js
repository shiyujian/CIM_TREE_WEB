import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/create';
import {actions as platformActions} from '_platform/store/global';
import {Steps, Append, Structure, Bind} from '../components/Create';
import queryString from 'query-string';

@connect(
	state => {
		const {system: {create = {}} = {}, platform} = state;
		return {create, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class Create extends Component {
	static propTypes = {};

	render() {
		const {location} = this.props;
		const {current = '0'} = queryString.parse(location.search) || {};
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<Steps {...this.props}/>
				{current === '0' && <Append {...this.props}/>}
				{current === '1' && <Structure {...this.props}/>}
				{current === '2' && <Bind {...this.props}/>}
			</div>
		);
	}
}
