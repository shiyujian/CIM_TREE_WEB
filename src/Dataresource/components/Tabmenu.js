import React, {Component} from 'react';
import {Table, Spin,Tabs} from 'antd';
import moment from 'moment';
import './index.less'
const TabPane = Tabs.TabPane;

export default class Tabmenu extends Component {

	render() {
		let {data} = this.props;
		return (
			<Tabs type="card" onChange={this.props.onTabChange}>
				{
					data&&data.map((item,index) => {
						return <TabPane tab={item.name} key={String(index)} >{this.lineTable(item.children)}</TabPane>
					})
				}
			 </Tabs>
		);
	}
	lineTable(details) {
		let columns = [{
				title:'名称',
				dataIndex: 'name',
				// render: (text,record) => {
				// 	return (<div>
				// 			<span>{record.name}</span>
				// 			<span style={{float:"right"}}>{record.number}</span>
				// 	</div>)
				// }
			}];
		return <Table bordered
				 style={{padding:'5px'}}
				 columns={columns} 
				 rowKey={record => record.name}
				 rowClassName={this.rowClassName}
				 dataSource={details} 
				 showHeader={false}
				 pagination={false}
				 onRowClick={this.props.onTblRowClick}
				/>
	}
	rowClassName = (record) => {
        const { SelectedRow } = this.props
        return SelectedRow
        ? record.name === SelectedRow.name
        ? 'table-row-selected contcenter cursorp'
        : 'contcenter cursorp'
        : 'contcenter cursorp'
    }
}