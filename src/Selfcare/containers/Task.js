import React, {Component} from 'react';
import {Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/task';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Info, Detail, Docs, Step} from '../components/Task';
import {actions as platformActions} from '_platform/store/global';
import {Spin,Form} from 'antd';

@connect(
	state => {
		const {selfcare: {task = {}} = {}, platform} = state || {};
		return {...task, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Task extends Component {
	static propTypes = {};

	render() {
		return (
			<Content>
				<DynamicTitle title="个人任务-详情" {...this.props}/>
				<Spin tip="加载中" spinning={this.props.detailLoading}>
					<Info {...this.props}/>
					<Detail {...this.props}/>
					<Step {...this.props}/>
				</Spin>
				{/* <Docs {...this.props}/> */}
			</Content>
		);
	}
};
Task = Form.create({})(Task);
