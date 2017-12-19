import React, {Component} from 'react';
import {Steps} from 'antd';
import queryString from 'query-string';

const Step = Steps.Step;

export default class CreateSteps extends Component {
	render() {
		const {location} = this.props;
		const {current = '0'} = queryString.parse(location.search) || {};
		return (
			<div style={{width: 600, margin: '20px auto'}}>
				<Steps current={+current}>
					<Step title="填写信息"/>
					<Step title="创建结构"/>
					<Step title="创建规则"/>
				</Steps>
			</div>
		);
	}
}
