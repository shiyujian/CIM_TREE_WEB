import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import reducer, {actions} from '../store/treeManage';
import {Table} from '../components/TreeManage';
@connect(
	state => {
		const {project:{treeManage = {}}, platform} = state || {};
		return {...treeManage, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class TreeManage extends Component {
	static propTypes = {};

	render() {
		return (
			<div style={{
				padding: 20, height: 'calc(100% - 37px)',
				minHeight: '505px', 'overflowY': 'auto'
			}}>
				<DynamicTitle title="树种管理" {...this.props}/>
				<Table {...this.props}/>
				{/* <Addition {...this.props}/> */}
				{/* <Edite {...this.props}/> */}
			</div>
		);
	}

	
}