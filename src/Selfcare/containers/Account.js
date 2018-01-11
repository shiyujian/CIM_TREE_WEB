import React, {Component} from 'react';
import {Content, DynamicTitle, Sidebar} from '_platform/components/layout';
import {actions} from '../store/account';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Tree, AccountTable} from '../components/Account';
import {actions as platformActions} from '_platform/store/global';
import {Spin} from 'antd';

@connect(
	state => {
		const {selfcare: {account = {}} = {}, platform} = state || {};
		return {...account, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Account extends Component {
	static propTypes = {};

	render() {
		return (
			<Content>
				<DynamicTitle title="账号管理" {...this.props}/>
				<Sidebar>
					<Tree {...this.props}/>
				</Sidebar>
				<Content>
					<AccountTable {...this.props}/>
				</Content>
			</Content>
		);
	}
};
