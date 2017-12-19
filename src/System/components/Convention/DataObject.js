import React, {Component} from 'react';
import List from './List';

export default class DataObject extends Component {

	render() {
		const { dataobject={}} = this.props;
		const data = [
		  'WBS对象',
		  '文档',
		  '组织机构',
		  '人员',
		  '设备',
		];
		return (
			<List
			 header={<div>数据对象列表</div>}
			 dataSource={data}
			 selectedtitle={dataobject.title}
			 onChange={this.listclick.bind(this)}
			/>
		);
	}
	listclick(title) {
		const {actions: {changeDataobjectField}} = this.props;
		changeDataobjectField('title',title)
	}
}
