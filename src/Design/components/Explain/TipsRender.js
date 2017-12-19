import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card} from 'antd';

export default class TipRender extends Component {

	static propTypes = {

	};
	render() {
		return (
			<Card title="提示" style={{ width: '100%' }}>
				<div>{this.props.container || ''}</div>
			</Card>
		);
	}
}
