import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/dict';
import {actions as platformActions} from '_platform/store/global';
import {Row,Col} from 'antd';
import {Info, Addition,Dictvalue,DictCreate} from '../components/Dict';

@connect(
	state => {
		const {system: {dict = {}} = {}, platform} = state;
		return {...dict, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class Dict extends Component {
	static propTypes = {};
	render() {
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="编码字段" {...this.props}/>
				<Row >
					<Col span={12} style={{borderRight:'1px solid rgb(233, 233, 233)'}}>
						<Info {...this.props}/>
					</Col>
					<Col span={12}>
						<Dictvalue {...this.props}/>
					</Col>
				</Row>
				<Addition {...this.props}/>
				<DictCreate {...this.props}/>
			</div>
		);
	}
}
