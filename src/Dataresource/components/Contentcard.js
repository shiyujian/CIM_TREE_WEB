import React, {Component} from 'react';
import {Row, Col, Rate,Button} from 'antd';
import moment from 'moment';
import './index.less';

export default class Contentmiddle extends Component {

	render() {
		let {item = [],index,ischange} = this.props;
		return (
			<div className={'f15 mg19'}>
				<Row className={'mg5'}>
					<Col span={24}>
						<a onClick={() => this.props.onDetailClick(index)} className={'contoptitle'}>{`· ${item.title}`}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						{
							ischange
							?   <span>
									<Button onClick={() => this.props.onEdit(index)}>编辑</Button>&nbsp;&nbsp;&nbsp;
									<Button onClick={() => this.props.onDelete(index)}>删除</Button>
								</span>
							: <span/>	
						}
					</Col>	
				</Row>
				<Row className={'mg2'}>
					<Col span={4}>
						<span>更新时间：</span><a>{`${item.updatetime}`}</a>
					</Col>
					<Col span={4}>
						<span>查看：</span><a>{`${item.looknum}`}</a><span>人</span>
					</Col>
					<Col span={4}>
						<span>下载：</span><a>{`${item.downnum}`}</a><span>次</span>
					</Col>
				{/*	<Col span={4}>
						<span>评分：</span><Rate disabled defaultValue={5}/>
					</Col>*/}
				</Row>
				{/*<Row className={'mg2'}>
					<Col span={24}>
						<span>数据领域：</span><span>{`${item.gov}`}</span>
					</Col>	
				</Row>
				<Row className={'mg2'}>
					<Col span={24}>
						<span>资源摘要：</span><span>{`${item.source}`}</span>
					</Col>	
				</Row>*/}
			</div>
		);
	}
}