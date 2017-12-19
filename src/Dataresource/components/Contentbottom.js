import React, {Component} from 'react';
import {Row, Col, Pagination } from 'antd';
import moment from 'moment';
import './index.less';
import Contentcard from './Contentcard';

export default class Contentbottom extends Component {

	render() {
		let {data = [],total,pageSize,current} = this.props;
		return (
			<div className='contbottom'>
				<Pagination onChange={this.props.onPageChange} defaultCurrent={1} pageSize={pageSize} total={total} current={current}/>
			</div>
		);
	}
}