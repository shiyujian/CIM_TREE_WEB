import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/ModalData';
import {actions as platformActions} from '_platform/store/global';
import Preview from '../../_platform/components/layout/Preview';
import {Table, Addition, Check, Modify, Expurgate} from '../components/ModalData';
import {Row,Col} from 'antd';
@connect(
	state => {
		const {datareport: {modaldata = {}} = {}, platform} = state;
		return {...modaldata, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class ModalData extends Component {
	render() {
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="模型信息" {...this.props}/>
				<Row >
					<Col >
						<Table {...this.props}/>
					</Col>
				</Row>
				<Addition {...this.props}/>
				<Modify {...this.props}/>
				<Expurgate {...this.props}/>
				<Preview/>
			</div>
		);
	}
}
