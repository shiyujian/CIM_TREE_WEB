import React, {Component} from 'react';
import {DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Tabs} from 'antd';
import PutDocPage from '../components/DocDispatch/PutDocPage';
import GetDocPage from '../components/DocDispatch/GetDocPage';
import DocView from '../components/DocDispatch/DocView';

import {actions} from '../store/docdispatch';
import {Row, Col} from 'antd';

const TabPane = Tabs.TabPane;

@connect(
	state => {
		const {platform, overall: {docdispatch={}} } = state|| {};
		return {...docdispatch,platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Dispatch extends Component {

	static propTypes = {};

	docPutOrGetTabChange(docPutOrGetTabValue) {
		const {actions: {setDocPutOrGetTabValue}} = this.props;
		setDocPutOrGetTabValue(docPutOrGetTabValue);
	}

	render() {
		const {
			docPutOrGetTabValue = '1',
		} = this.props;
		return (
			<Row>
				<Col>
						<DynamicTitle title="现场收发文" {...this.props}/>
						<Tabs activeKey={docPutOrGetTabValue} onChange={this.docPutOrGetTabChange.bind(this)}>
							<TabPane tab="发出的文件列表" key="1">
								<PutDocPage {...this.props}/>
							</TabPane>
							<TabPane tab="收到的文件列表" key="2">
								<GetDocPage {...this.props}/>
							</TabPane>
						</Tabs>
				</Col>
			</Row>
			);
	}
}
