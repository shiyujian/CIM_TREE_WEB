import React, {Component} from 'react';
import {Row, Col} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Notice, State, Bulletin, Video} from '../components/Trend';
import * as previewActions from '_platform/store/global/preview';
import Preview from '_platform/components/layout/Preview';
import {actions as newsActions} from '../store/trend';


@connect(
	state => {
		const {safety: {trend = {}}, platform} = state || {};
		return {...trend, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...newsActions,...platformActions,...previewActions}, dispatch)
	}),
)

export default class Trend extends Component {

	render() {
		const props = this.props;
		return (
			<div>
				<DynamicTitle title="安全动态" {...this.props}/>
				<Row gutter={10} style={{margin: '5px 5px 5px 5px', height: 390}}>
					<Col span={11}>
						{Notice && <Notice {...props}/>}
					</Col>
					<Col span={11}>
						{State && <State {...props}/>}
					</Col>
				</Row>
				<Row gutter={10} style={{margin: '5px 5px 5px 5px', height: 390}}>
					<Col span={11}>
						{Bulletin && <Bulletin {...props}/>}
					</Col>
					<Col span={11}>
						{Video && <Video {...props}/>}
					</Col>
				</Row>
				{/*<Preview/>*/}
			</div>
		);
	}
}
