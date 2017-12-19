import React, {Component} from 'react';
import {Row, Col,Button} from 'antd';
import moment from 'moment';
import './index.less'

export default class Detailcontent extends Component {

	render() {
		let {data = {}} = this.props;
		return (
			<div>
				<Row>
					<Col span={24}>
						<Button onClick={this.props.onReturnClick}>返回</Button>&nbsp;&nbsp;&nbsp; <span className={'f18'}>{`${data.name}`}</span>
					</Col>
				</Row>
				<hr style={{marginTop:'10px',height:'5px',border:'none',borderTop:'1px solid #F2F2F2'}} />
				<Row>
					<Col span={18}>
						<Row className={'mg5'}>
							<Col span={24} className='f15'>
								<span>数据领域：</span><span >{`${data.datafield}`}</span>
							</Col>
						</Row>
						<Row className={'mg5'}>
							<Col span={24} className='f15'>
								<span>摘要：</span><span >{`${data.abstract}`}</span>
							</Col>
						</Row>
						<Row className={'mg5'}>
							<Col span={24} className='f15'>
								<span>数据密级：</span><span >{`${data.datadense}`}</span>
							</Col>
						</Row>
						<Row className={'mg5'}>
							<Col span={24} className='f15'>
								<span>{`${data.dataprecisiontitle}`}</span><span >{`${data.dataprecision}`}</span>
							</Col>
						</Row>
						<Row className={'mg5'}>
							<Col span={24} className='f15'>
								<span>发布日期：</span><span >{`${data.releasedata}`}</span>&nbsp;&nbsp;&nbsp;
								<span>更新日期：</span><span >{`${data.updatetime}`}</span>
							</Col>
						</Row>
						<Row className={'mg5'}>
							<Col span={24} className='f15'>
								<span>数据提供方单位：</span><span >{`${data.dataoffer}`}</span>
							</Col>
						</Row>
						<Row className={'mg5'}>
							<Col span={24} className='f15'>
								<span>数据维护方单位：</span><span >{`${data.datapreserver}`}</span>
							</Col>
						</Row>
					</Col>
					<Col span={6}>
						<div className='contimgarea200'>
							<img className='contimg200' src={require("./ImageIcon/search.png")} alt="搜索"/>
							<a>在线预览</a>
						</div>
					</Col>
				</Row>
				<hr style={{marginTop:'10px',height:'5px',border:'none',borderTop:'1px solid #F2F2F2'}} />
				<Row>
					<Col span={12}>
						<div className='contimgarea350'>
							<span className='f20'>数据范围</span>
							<img className='contimg350' src={data.datarangeimgsrc ? require(`${data.datarangeimgsrc}`) : ''} alt="搜索"/>
						</div>
					</Col>
					<Col span={12}>
						<div className='contimgarea350'>
							<span className='f20'>数据样例</span>
							<img className='contimg350' src={data.dataexampleimgsrc ? require(`${data.dataexampleimgsrc}`) : ''} alt="搜索"/>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}