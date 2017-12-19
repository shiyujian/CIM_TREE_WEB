import React, {Component} from 'react';
import {Row, Col, Button} from 'antd';
import moment from 'moment';
import './index.less'

export default class Contenttop extends Component {

	render() {
		let {data = {},selected,ischange,datalength} = this.props;
		console.log(selected)
		return (
			<Row>
				<Col span={8}>
					<span className={'f18'}>{`${data.name}(共${datalength}条数据)`}</span>
				</Col>
				<Col span={4} >
					<Button onClick={this.props.Oncreat}>新建</Button>
					{
						ischange 
						? <Button onClick={this.props.Onchange}>保存</Button>
						: <Button onClick={this.props.Onchange}>修改</Button>
					}
				</Col>
				<Col span={3} >
					<div className={selected === 1 ? 'span-selected w80' : 'w80'} onClick={() => this.props.Onselect(1)}>
						<span className={'f15 cursorp'}>更新时间</span><i className="ecidi ecidi-jd3"></i>
					</div>
				</Col>
				<Col span={3}>
					<div className={selected === 2 ? 'span-selected w80' : 'w80'} onClick={() => this.props.Onselect(2)}>
						<span className={'f15 cursorp'}>数据评分</span><i className="ecidi ecidi-jd3"></i>
					</div>
				</Col>
				<Col span={3}>
					<div className={selected === 3 ? 'span-selected w80' : 'w80'} onClick={() => this.props.Onselect(3)}>
						<span className={'f15 cursorp'}>下载数量</span><i className="ecidi ecidi-jd3"></i>
					</div>
				</Col>
				<Col span={3}>
					<div className={selected === 4 ? 'span-selected w80' : 'w80'} onClick={() => this.props.Onselect(4)}>
						<span className={'f15 cursorp'}>访问数量</span><i className="ecidi ecidi-jd3"></i>
					</div>
				</Col>
			</Row>
		);
	}
}