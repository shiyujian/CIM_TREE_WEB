import React, {Component} from 'react';
import {Row, Col} from 'antd';
import moment from 'moment';
import './index.less';
import Contentcard from './Contentcard';

export default class Contentmiddle extends Component {

	render() {
		let {data = [],ischange,pageindex,pageSize} = this.props;
		return (
			<div className='h660'>
				{
					data&&data.map((item,index) => {
					return	<Row key={index}>
								<Col span={24}>
									<Contentcard 
										item={item} 
										ischange={ischange} 
										index={(pageindex - 1 ) * pageSize + index} 
										onDetailClick={this.props.onDetailClick}
										onEdit={this.props.onEdit}
										onDelete={this.props.onDelete}
									/>
								</Col>
							</Row>
					})
				}
			</div>
		);
	}
}