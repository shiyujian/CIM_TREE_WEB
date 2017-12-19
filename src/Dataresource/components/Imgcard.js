import React, {Component} from 'react';
import {Row, Col, Rate,Button} from 'antd';
import moment from 'moment';
import './index.less';

export default class Contentmiddle extends Component {

	render() {
		let {item = [], index,ischange } = this.props;
		return (
			<Col span={6} className='contimgcol'>
				<div className='contimgarea'>
					<img className='contimg' src={item.src ? require(`${item.src}`) : ''} alt="图片"/>
					<span>{item.title}</span>
					<div className='mg5'>
						<Button className='mgr5'>详细信息</Button>
						<Button className='mgl5'>数据列表</Button>
					</div>
					{
						ischange
						?	<div className='mg5'>
								<Button className='mgr5' onClick={() => this.props.onEdit(index)}>修改</Button>
								<Button className='mgl5' onClick={() => this.props.onDelete(index)}>删除</Button>
							</div>
						: <span/>
					}
				</div>
			</Col>
		);
	}
}