import React, {Component} from 'react';
import {Row, Col} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {News, Datum, Safety, Staff, Schedule, Quality} from '../components';
import * as previewActions from '_platform/store/global/preview';
import Preview from '_platform/components/layout/Preview';
import {actions as newsActions} from '../store/news';
import {actions as staffActions} from '../store/staff';
import banner from '../components/images/banner.png';



@connect(
	state => {
		const {home: {news = {},staff = {}}, platform} = state || {};
		return {...news,...staff, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...newsActions,...staffActions ,...platformActions,...previewActions}, dispatch)
	}),
)

export default class Home extends Component {

	render() {
		const props = this.props;
		const bannerUrl=banner;
		return (
			<div>
				<Row>
					<Col span={24}>
						<img  style={{width:'100%'}}src={bannerUrl} />
					</Col>
				</Row>
				<Row gutter={10} style={{margin: '5px 5px 5px 5px'}}>
					<Col span={12}>
						{News && <News {...props}/>}
					</Col>
					<Col span={12}>
						{Datum && <Datum {...props}/>}
					</Col>
				</Row>
				<Row gutter={10} style={{margin: '5px 5px 5px 5px'}}>
					<Col span={12}>
						{Schedule && <Schedule {...props}/>}
					</Col>
					<Col span={12}>
						{Staff && <Staff {...props}/>}
					</Col>
				</Row>

				{/* <Row gutter={10} style={{margin: '5px 5px 5px 5px'}}>
					{Safety && <Safety {...props}/>}
				</Row>
				<Row gutter={10} style={{margin: '5px 5px 5px 5px'}}>
					{Quality && <Quality {...props}/>}				
				</Row> */}
				

				<Preview/>
			</div>
		);
	}
}
