import React, {Component} from 'react';
import {Row, Col, Rate,Button} from 'antd';
import moment from 'moment';
import './index.less';

export default class Hotdata extends Component {

	render() {
		let {item = []} = this.props;
		return (
			<Row span={6} >
				<Col span={8} className='f20 pad30'>
					<div>
						<span className='fwb'>热门数据</span>
						<a className='contfr'>MORE>></a>
					</div>
					<hr style={{marginTop:'10px',height:'5px',border:'none',borderTop:'1px solid #F2F2F2'}} />
					<li>
						<span>雄安新区起步区倾斜摄影成果</span>
						<span className='contfr'>[4231]</span>
					</li>
					<li>
						<span>雄安新区第一阶段地质调查成果</span>
						<span className='contfr'>[184]</span>
					</li>
				</Col>
				<Col span={8} className='f20 pad30'>
					<div>
						<span className='fwb'>最新数据</span>
						<a className='contfr'>MORE>></a>
					</div>
					<hr style={{marginTop:'10px',height:'5px',border:'none',borderTop:'1px solid #F2F2F2'}} />
					<li>
						<span>容东容西移民安置区倾斜摄影成果</span>
						<span className='contfr'>2017-10-13</span>
					</li>
				</Col>
				<Col span={8} className='f20 pad30'>
					<div>
						<span className='fwb'>推荐数据</span>
						<a className='contfr'>MORE>></a>
					</div>
					<hr style={{marginTop:'10px',height:'5px',border:'none',borderTop:'1px solid #F2F2F2'}} />
					<li>
						<span>植树造林项目招标公告</span>
						<span className='contfr'>[26]</span>
					</li>
				</Col>
			</Row>
		);
	}
}