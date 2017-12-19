import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/convention';
import {actions as platformActions} from '_platform/store/global';
import {DataObject,CodeType,DataPage, Fields, Addition, Imported, Group, Table} from '../components/Convention';
import {Row,Col} from 'antd'
@connect(
	state => {
		const {system: {convention = {}} = {}, platform} = state;
		return {...convention, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class Convention extends Component {
	static propTypes = {};

	render() {
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="编码配置" {...this.props}/>
				<Row gutter={20}>
					<Col span={5}>
						<DataObject {...this.props}/>
					</Col>
					<Col span={19}>
						<CodeType {...this.props}/>
					</Col>
				</Row>
				<Row gutter={20}>
					<Col span={5}>
						<DataPage {...this.props}/>
					</Col>
					<Col span={19}>
					<Row gutter={10}>
						<Col span={5}>
							<Fields {...this.props}/>
						</Col>
						<Col span={19}>
							<Table {...this.props}/>
						</Col>
					</Row>	
					</Col>
				</Row>
				<Addition {...this.props}/>
				<Imported {...this.props}/>
				<Group {...this.props}/>
			</div>
		);
	}
}
