/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { DynamicTitle, Content } from '_platform/components/layout';
import { Table, Row, Col, Button} from 'antd';
import {SumPlan} from '../components/CostListData'
import {actions} from '../store/DesignData';
import {actions as platformActions} from '_platform/store/global';

@connect(
	state => {
		const {datareport: {designdata = {}} = {}, platform} = state;
		return {...designdata, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)

export default class BalanceSchedule extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div>
				<DynamicTitle title="结算进度表" {...this.props}/>
				<Content>
					计算进度
				</Content>
			</div>)
	}
};
